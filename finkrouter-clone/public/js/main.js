/* ═══════════════════════════════════════════════════════
   FINKROUTER CLONE — JavaScript
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. HEADER SCROLL BEHAVIOR ─── */
(function() {
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
})();

/* ─── 2. MOBILE MENU ─── */
(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  let open = false;

  toggle?.addEventListener('click', () => {
    open = !open;
    if (open) {
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'all';
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Close on link click
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── 3. SCROLL REVEAL (IntersectionObserver) ─── */
(function() {
  const revealEls = document.querySelectorAll(
    '.anim-reveal, .anim-reveal-up, .anim-reveal-delay, .anim-fade-up, .anim-fade-in, .anim-fade-in-delay, .anim-slide-left'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Staggered reveal for reveal-up children
  document.querySelectorAll('.anim-reveal-up').forEach((el, i) => {
    const delay = el.style.transitionDelay || (i * 100) + 'ms';
    el.style.transitionDelay = delay;
  });
})();

/* ─── 4. HERO – BLURRED CHARACTER ANIMATION ─── */
(function() {
  const words = ['nhạnh', 'chính xác', 'ổn định', 'linh hoạt', 'nhanh'];
  const colors = [
    ['#eca8d6', '#a78bfa', '#67e8f9', '#fbbf24', '#eca8d6'],
    ['#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#34d399'],
    ['#fbbf24', '#eca8d6', '#6ee7b7', '#67e8f9', '#fbbf24'],
    ['#f87171', '#eca8d6', '#a78bfa', '#34d399', '#f87171'],
    ['#67e8f9', '#fbbf24', '#eca8d6', '#f472b6', '#67e8f9'],
  ];

  let wordIndex = 0;
  const container = document.getElementById('hero-word');
  if (!container) return;

  function renderWord(word, palette) {
    container.innerHTML = '';
    [...word].forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.filter = 'blur(20px)';
      span.style.color = palette[i % palette.length];
      span.style.transition = `opacity 0.4s ease ${i * 60}ms, filter 0.4s ease ${i * 60}ms`;
      container.appendChild(span);
    });

    // Trigger entrance
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.querySelectorAll('span').forEach(span => {
          span.style.opacity = '1';
          span.style.filter = 'blur(0)';
        });
      });
    });
  }

  function exitWord(cb) {
    container.querySelectorAll('span').forEach((span, i) => {
      span.style.transition = `opacity 0.3s ease ${i * 30}ms, filter 0.3s ease ${i * 30}ms`;
      span.style.opacity = '0';
      span.style.filter = 'blur(20px)';
    });
    setTimeout(cb, 500);
  }

  // First render immediately
  renderWord(words[wordIndex], colors[wordIndex]);

  setInterval(() => {
    exitWord(() => {
      wordIndex = (wordIndex + 1) % words.length;
      renderWord(words[wordIndex], colors[wordIndex]);
    });
  }, 3200);
})();

/* ─── 5. FEATURE CARD CANVAS PARTICLES ─── */
(function() {
  document.querySelectorAll('.feature-card').forEach(card => {
    const canvas = card.querySelector('.feature-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let active = false;

    function resize() {
      canvas.width  = card.offsetWidth;
      canvas.height = card.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = 30;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - .5) * .8,
          vy: (Math.random() - .5) * .8,
          r: Math.random() * 1.5 + .5,
          alpha: Math.random() * .6 + .2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,168,214,${p.alpha})`;
        ctx.fill();

        // Connect nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(236,168,214,${(1 - dist/80) * .15})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      });

      if (active) animId = requestAnimationFrame(draw);
    }

    card.addEventListener('mouseenter', () => {
      active = true;
      resize();
      createParticles();
      draw();
    });

    card.addEventListener('mouseleave', () => {
      active = false;
      cancelAnimationFrame(animId);
    });

    new ResizeObserver(resize).observe(card);
    resize();
  });
})();

/* ─── 6. HOW IT WORKS – STEP SWITCHER ─── */
(function() {
  const steps = document.querySelectorAll('.hiw-step');
  if (!steps.length) return;

  let current = 0;
  let timer;

  const testimonials_data = [
    { id: 'hiw-step-1' },
    { id: 'hiw-step-2' },
    { id: 'hiw-step-3' },
  ];

  function activate(index) {
    steps.forEach((step, i) => {
      const indicator = step.querySelector('div[class*="absolute"]') || step.querySelector('div.absolute');
      const numEl = step.querySelector('span.text-4xl');
      const progressEl = step.querySelector('.hiw-progress');
      const descEl = step.querySelector('.hiw-desc');
      const barEl = step.querySelector('.absolute.bottom-0');

      step.classList.remove('hiw-step-active');
      step.style.background = '#000';
      step.style.borderColor = 'rgba(255,255,255,.25)';

      if (numEl) numEl.style.color = 'rgba(255,255,255,.2)';
      if (descEl) descEl.style.opacity = '.6';

      // Reset bottom bar
      const bottomBar = step.querySelectorAll('div.absolute');
      bottomBar.forEach(b => {
        if (b.style.height === '4px' || b.classList.contains('absolute')) {
          if (b.style.bottom === '0px' || getComputedStyle(b).bottom === '0px') {
            b.style.transform = 'scaleX(0)';
          }
        }
      });

      if (i === index) {
        step.classList.add('hiw-step-active');
        step.style.borderColor = 'rgba(255,255,255,.6)';
        if (numEl) numEl.style.color = '#eca8d6';
        if (descEl) descEl.style.opacity = '1';

        // Animate bottom bar
        const bars = step.querySelectorAll('div[style*="bottom:0"]');
        bars.forEach(b => { b.style.transform = 'scaleX(1)'; });
      }
    });
    current = index;
  }

  steps.forEach((step, i) => {
    step.addEventListener('click', () => {
      clearInterval(timer);
      activate(i);
      startAuto();
    });
  });

  function startAuto() {
    timer = setInterval(() => {
      activate((current + 1) % steps.length);
    }, 6000);
  }

  activate(0);
  startAuto();
})();

/* ─── 7. REAL-TIME STATS COUNTERS ─── */
(function() {
  function animateCount(el, target, suffix = '', duration = 2000) {
    if (!el) return;
    const start = performance.now();
    const initial = parseInt(el.textContent) || 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(initial + (target - initial) * eased);
      el.textContent = value.toLocaleString() + suffix;
      el.style.filter = 'blur(0)';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Mini sparkline canvas
  function drawSparkline(canvas, data, color = '#eca8d6') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.offsetWidth || 200;
    const h = canvas.height || 36;
    canvas.width  = w;
    canvas.height = h;

    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;

    ctx.clearRect(0, 0, w, h);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill below
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Generate random sparkline data
  function genData(base, variance, len = 20) {
    return Array.from({ length: len }, () => base + (Math.random() - .5) * variance * 2);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const reqEl = entry.target.querySelector('#stat-requests .stat-num');
      const uptimeEl = entry.target.querySelector('#stat-uptime');
      const latencyEl = entry.target.querySelector('#stat-latency');

      setTimeout(() => {
        animateCount(reqEl, 1284720, '', 2500);
        animateCount(uptimeEl, 99, '', 1500);
        animateCount(latencyEl, 12, '', 1500);

        drawSparkline(document.getElementById('stat-canvas-1'), genData(80000, 30000), '#eca8d6');
        drawSparkline(document.getElementById('stat-canvas-2'), genData(99.8, .15), '#34d399');
        drawSparkline(document.getElementById('stat-canvas-3'), genData(11, 4), '#60a5fa');
      }, 300);
    });
  }, { threshold: .2 });

  const statsSection = document.querySelector('#stat-requests');
  if (statsSection) observer.observe(statsSection.closest('section'));

  // Live update every few seconds
  setInterval(() => {
    const reqEl = document.querySelector('#stat-requests .stat-num');
    if (reqEl && document.querySelector('#stat-requests').closest('section').getBoundingClientRect().top < window.innerHeight) {
      const cur = parseInt(reqEl.textContent.replace(/,/g, '')) || 1284720;
      animateCount(reqEl, cur + Math.floor(Math.random() * 50 + 10), '', 400);
      drawSparkline(document.getElementById('stat-canvas-1'), genData(80000, 30000), '#eca8d6');
      drawSparkline(document.getElementById('stat-canvas-2'), genData(99.8, .15), '#34d399');
      drawSparkline(document.getElementById('stat-canvas-3'), genData(11, 4), '#60a5fa');
    }
  }, 3000);
})();

/* ─── 8. PARTICLES CANVAS BACKGROUND ─── */
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function init() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .3,
        vy: (Math.random() - .5) * .3,
        r: Math.random() * 1 + .3,
        alpha: Math.random() * .4 + .05,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236,168,214,${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(236,168,214,${(1 - dist/100) * .08})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ─── 9. TESTIMONIALS CAROUSEL ─── */
(function() {
  const testimonials = [
    {
      quote: 'Tôi từng bị rớt các luồng tool-calling trong Claude Code cứ mỗi 30 phút. FINKROUTER đã giải quyết hoàn hảo chỉ bằng một dòng code. Không còn lỗi Ghost Drop nào xảy ra nữa.',
      name: 'Alex T.', role: 'Senior Engineer, Vercel', avatar: 'A',
    },
    {
      quote: 'Context window 1M token thực sự là game-changer. Tôi có thể nạp toàn bộ codebase vào session mà không lo bị cắt giữa chừng. FINKROUTER là must-have.',
      name: 'Minh N.', role: 'CTO, Startup Hà Nội', avatar: 'M',
    },
    {
      quote: 'Setup mất đúng 30 giây — chỉ đổi một dòng base_url. Hệ thống đã chạy liên tục 45 ngày không ngắt quãng. Tốc độ routing cực nhanh, latency dưới 20ms.',
      name: 'Sarah K.', role: 'AI Platform Lead, TechCorp', avatar: 'S',
    },
    {
      quote: 'Multi-model fallback là tính năng tôi cần nhất. Khi Claude 429, hệ thống tự chuyển sang Gemini không cần can thiệp. Production vẫn chạy mượt 100%.',
      name: 'David L.', role: 'Cursor Power User', avatar: 'D',
    },
  ];

  let current = 0;
  let timer;
  const DURATION = 8000;

  const quoteEl   = document.getElementById('testimonial-quote');
  const nameEl    = document.getElementById('testimonial-name');
  const roleEl    = document.getElementById('testimonial-role');
  const avatarEl  = document.getElementById('testimonial-avatar');
  const indicators = document.querySelectorAll('.testimonial-indicator');

  if (!quoteEl) return;

  function goTo(index, dir = 1) {
    current = (index + testimonials.length) % testimonials.length;
    const t = testimonials[current];

    // Fade out
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = `translateY(${dir * 10}px)`;
    quoteEl.style.transition = 'opacity .3s, transform .3s';

    setTimeout(() => {
      quoteEl.textContent   = t.quote;
      nameEl.textContent    = t.name;
      roleEl.textContent    = t.role;
      avatarEl.textContent  = t.avatar;

      quoteEl.style.opacity   = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 300);

    // Update indicators
    indicators.forEach((ind, i) => {
      const bar = ind.querySelector('div');
      if (!bar) return;
      bar.style.animation = 'none';
      bar.style.width = i === current ? '0%' : '0%';
      if (i === current) {
        void bar.offsetWidth; // reflow
        bar.style.animation = `progress ${DURATION}ms linear forwards`;
      }
    });
  }

  document.getElementById('testimonial-prev')?.addEventListener('click', () => {
    clearInterval(timer);
    goTo(current - 1, -1);
    startAuto();
  });

  document.getElementById('testimonial-next')?.addEventListener('click', () => {
    clearInterval(timer);
    goTo(current + 1, 1);
    startAuto();
  });

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      startAuto();
    });
  });

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), DURATION);
  }

  goTo(0);
  startAuto();
})();

/* ─── 10. PRICING TAB SWITCHER ─── */
window.switchPricing = function(tab) {
  const bundleEl = document.getElementById('bundle-plans');
  const paygEl   = document.getElementById('payg-plans');
  const tabBundle = document.getElementById('tab-bundle');
  const tabPayg   = document.getElementById('tab-payg');

  if (tab === 'bundle') {
    bundleEl.style.display = '';
    paygEl.style.display   = 'none';
    tabBundle.classList.add('pricing-tab-active');
    tabPayg.classList.remove('pricing-tab-active');
    tabPayg.style.color = 'rgba(255,255,255,.5)';
    tabBundle.style.color = '';
  } else {
    bundleEl.style.display = 'none';
    paygEl.style.display   = '';
    tabPayg.classList.add('pricing-tab-active');
    tabBundle.classList.remove('pricing-tab-active');
    tabBundle.style.color = 'rgba(255,255,255,.5)';
    tabPayg.style.color = '';
  }
};

/* ─── 11. SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 12. CTA BUTTONS ─── */
document.querySelectorAll('#nav-cta, #hero-start-routing, #cta-start-free').forEach(btn => {
  btn?.addEventListener('click', () => {
    document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── 13. FOOTER CANVAS PARTICLES ─── */
(function() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const canvas = footer.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let pts = [];

  function resize() {
    canvas.width  = footer.offsetWidth;
    canvas.height = footer.querySelector('.relative').offsetHeight || 420;
  }

  function init() {
    pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 1 + .5,
      a: Math.random() * .3 + .05,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236,168,214,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ─── 14. INTEGRATION CARDS HOVER FILL ─── */
document.querySelectorAll('.integration-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const bar = card.querySelector('.integration-bar');
    if (bar) bar.style.width = '100%';
  });
  card.addEventListener('mouseleave', () => {
    const bar = card.querySelector('.integration-bar');
    if (bar) bar.style.width = '0%';
  });
});

/* ─── 15. REGION CARDS HOVER ─── */
document.querySelectorAll('.region-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const dot = card.querySelector('.node-indicator');
    if (dot) dot.style.background = '#eca8d6';
    card.style.borderColor = 'rgba(236,168,214,.4)';
    card.style.background  = 'rgba(236,168,214,.04)';
  });
  card.addEventListener('mouseleave', () => {
    const dot = card.querySelector('.node-indicator');
    if (dot && !dot.classList.contains('active')) dot.style.background = 'rgba(255,255,255,.2)';
    card.style.borderColor = '';
    card.style.background  = '';
  });
});

/* ─── 16. REVEAL ON LOAD (above-the-fold) ─── */
window.addEventListener('DOMContentLoaded', () => {
  // Immediately reveal hero elements
  setTimeout(() => {
    document.querySelectorAll('.hero-section .anim-fade-up, .hero-section .anim-fade-in').forEach(el => {
      el.classList.add('in-view');
    });
  }, 100);
});

console.log('%c🚀 FINKROUTER Clone loaded', 'color:#eca8d6;font-size:14px;font-weight:bold');
