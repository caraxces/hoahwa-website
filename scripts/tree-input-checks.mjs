// Real touch events and motion preferences supplement the desktop flow in test-tree.mjs.
export async function checkTreeInputs(browser, baseURL, artifactDir, verify, decodeScreenshot) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    recordVideo: { dir: `${artifactDir}/motion`, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage(), failures = [];
  page.setDefaultNavigationTimeout(90000);
  page.on('pageerror', e => failures.push(e.message));
  await page.addInitScript(() => localStorage.setItem('hoahwa-cookie-consent', JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), choices: { necessary: true, functional: false, analytics: false, marketing: false, doNotSell: false } })));
  const stage = page.locator('[data-testid="grove-canvas"]');
  const phase = value => page.waitForSelector(`[data-testid="grove-canvas"][data-phase="${value}"]`);
  const cdp = await context.newCDPSession(page);
  try {
    await page.goto(`${baseURL}/tree/`, { waitUntil: 'domcontentloaded' }); await phase('qr');
    verify(Number(await stage.getAttribute('data-pixel-ratio')) <= 1.5, 'A touch device with DPR 3 uses the mobile rendering budget');
    await page.click('[data-testid="morph-toggle"]'); await phase('tree');
    await page.waitForTimeout(200);
    const beforePinch = await stage.screenshot();
    const b = await stage.boundingBox(), x = b.x + b.width / 2, y = b.y + b.height / 2;
    const touches = gap => [{ x: x - gap, y, id: 1 }, { x: x + gap, y, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touches(45) });
    for (const gap of [52, 60, 70]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touches(gap) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(150);
    verify(await stage.getAttribute('data-phase') === 'tree' && !beforePinch.equals(await stage.screenshot()), 'A two-finger pinch changes the 3D view without accidentally folding it');
    await page.locator('[data-testid="grove-canvas"] canvas').focus();
    const beforeKey = await stage.screenshot();
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
    verify(!beforeKey.equals(await stage.screenshot()), 'Arrow keys rotate the tree');
    await page.keyboard.press('Escape'); await phase('qr');
    verify(await decodeScreenshot(await stage.screenshot()) === 'https://hoahwa.com', 'Escape restores a readable QR after touch and keyboard manipulation');

    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const start = Date.now();
    await page.click('[data-testid="morph-toggle"]'); await phase('tree');
    const duration = Date.now() - start;
    verify(duration < 6500, `Assembly completes with CPU throttled 4× (${duration} ms)`);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await page.click('[data-testid="morph-toggle"]'); await phase('qr');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.click('[data-testid="morph-toggle"]');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    verify(await stage.getAttribute('data-phase') === 'tree', 'Reduced motion switches directly to the assembled tree');
    await page.click('[data-testid="morph-toggle"]'); await phase('qr');
    verify(await decodeScreenshot(await stage.screenshot()) === 'https://hoahwa.com', 'Reduced motion also returns the exact scannable matrix');
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(150);
    verify(await decodeScreenshot(await stage.screenshot({ path: `${artifactDir}/scan-touch-landscape.png` })) === 'https://hoahwa.com', 'The QR remains readable after a phone changes to landscape');
    verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Landscape controls do not create horizontal overflow');
    verify(failures.length === 0, 'Touch, keyboard and reduced-motion checks produce no runtime errors');
  } finally {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
    await context.close();
  }
}
