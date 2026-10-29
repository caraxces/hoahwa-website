"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { TreePaletteId, TreeSeason } from "@/content/tree";
import { buildTreeMorph, morphColors, sampleMorphCell, smoothMorph } from "@/lib/qr-tree-morph";

type Props = {
  payload: string; hits: number; preview?: boolean; season: TreeSeason; palette: TreePaletteId;
  scanView: boolean; onToggleScan?: () => void; onUnsupported?: () => void;
};

/** One persistent cube per QR cell. Those same cubes assemble the tree and return to their source cells. */
export function GroveCanvas({ payload, hits, preview = false, season, palette, scanView, onToggleScan, onUnsupported }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ season, palette, scanView, onToggleScan, onUnsupported });
  const wakeRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    stateRef.current = { season, palette, scanView, onToggleScan, onUnsupported };
    wakeRef.current?.();
  }, [season, palette, scanView, onToggleScan, onUnsupported]);

  useEffect(() => {
    const mount = holderRef.current;
    if (!mount) return;
    const holder = mount;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { stateRef.current.onUnsupported?.(); return; }
    const model = buildTreeMorph(payload, hits, preview);
    const { cells, world } = model;
    const upAxis = new THREE.Vector3(0, 1, 0);
    const limbRotations = cells.map(c => c.direction ? new THREE.Quaternion().setFromUnitVectors(upAxis, new THREE.Vector3(c.direction.x, c.direction.y, c.direction.z).normalize()) : null);
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "QR tree. Enter to grow or fold. Arrow keys rotate. Plus and minus zoom. Escape returns to QR.");
    holder.append(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, world * 30);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const colors = new Float32Array(24 * 3);
    // The upward face is exact sRGB when the QR is flat; other faces communicate depth.
    [0.82, 0.68, 1, 0.56, 0.92, 0.74].forEach((value, face) => {
      for (let v = 0; v < 4; v++) colors.fill(value, (face * 4 + v) * 3, (face * 4 + v + 1) * 3);
    });
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const cubes = new THREE.InstancedMesh(geometry, material, cells.length);
    cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    cubes.frustumCulled = false;
    scene.add(cubes);
    const slabMaterial = new THREE.MeshBasicMaterial({ color: "#d8cbb9" });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(world + 0.18, 0.65, world + 0.18), slabMaterial);
    slab.position.y = -0.82;
    scene.add(slab);

    const flowerCells = cells.filter(c => c.role === "blossom");
    const blossomMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, alphaTest: 0.1, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true });
    const flowers = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), blossomMaterial, Math.max(1, flowerCells.length));
    flowers.count = flowerCells.length;
    flowers.frustumCulled = false;
    scene.add(flowers);
    let disposed = false, visible = true, raf = 0, frameCount = 0;
    let progress = stateRef.current.scanView ? 0 : 1;
    let lastTime = performance.now(), theta = 0.58, phi = 0.94, zoom = 1;
    let look = "", flatColors: THREE.Color[] = [], grownColors: THREE.Color[] = [];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dummy = new THREE.Object3D(), tint = new THREE.Color(), white = new THREE.Color("#ffffff"), offset = new THREE.Vector3();
    const flowerRotation = new THREE.Quaternion(), flowerAxis = new THREE.Vector3(0, 0, 1);
    let width = 1, height = 1;

    function fitCamera() {
      const k = smoothMorph(progress), radius = world * 7;
      camera.position.set(radius * Math.sin(phi * k) * Math.sin(theta * k), radius * Math.cos(phi * k), radius * Math.sin(phi * k) * Math.cos(theta * k));
      camera.up.set(0, k, -(1 - k)).normalize();
      camera.lookAt(0, model.height * 0.38 * k, 0);
      camera.updateMatrixWorld();
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const axes = camera.matrixWorldInverse.elements;
      for (const cell of cells) {
        const p = sampleMorphCell(cell, progress);
        offset.set(p.x, p.y, p.z).applyMatrix4(camera.matrixWorldInverse);
        const petals = cell.role === "blossom" && stateRef.current.season === "spring" ? smoothMorph((progress - 0.5) / 0.5) : 0;
        const rx = Math.max(p.size * petals * 1.3, p.tumble ? p.size * 0.867 : p.size * 0.5 * (Math.abs(axes[0]) + Math.abs(axes[4]) + Math.abs(axes[8])));
        const ry = Math.max(p.size * petals * 1.3, p.tumble ? p.size * 0.867 : p.size * 0.5 * (Math.abs(axes[1]) + Math.abs(axes[5]) + Math.abs(axes[9])));
        minX = Math.min(minX, offset.x - rx); maxX = Math.max(maxX, offset.x + rx);
        minY = Math.min(minY, offset.y - ry); maxY = Math.max(maxY, offset.y + ry);
      }
      const aspect = width / height, magnification = 1 + (zoom - 1) * k;
      const spanY = Math.max(maxY - minY + 0.8 * k, (maxX - minX) / aspect) * 1.055 / magnification;
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      camera.left = cx - spanY * aspect / 2; camera.right = cx + spanY * aspect / 2;
      camera.top = cy + spanY / 2; camera.bottom = cy - spanY / 2;
      camera.updateProjectionMatrix();
    }
    function frame(now: number) {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min(0.05, Math.max(0, now - lastTime) / 1000); lastTime = now;
      const state = stateRef.current, destination = state.scanView ? 0 : 1;
      const delta = Math.sign(destination - progress) * dt / 1.55;
      progress = motion.matches ? destination : Math.max(0, Math.min(1, progress + delta));
      if (Math.abs(progress - destination) < 0.001) progress = destination;
      const nextLook = `${state.season}:${state.palette}`;
      if (look !== nextLook) {
        look = nextLook;
        const pairs = cells.map(c => morphColors(c, model.size, state.season, state.palette));
        flatColors = pairs.map(c => new THREE.Color(c.flat));
        grownColors = pairs.map(c => new THREE.Color(c.grown));
      }
      let displaced = 0;
      const flowering = state.season === "spring" && Boolean(blossomMaterial.map);
      const bloom = flowering ? smoothMorph((progress - 0.5) / 0.5) : 0;
      for (const cell of cells) {
        const p = sampleMorphCell(cell, progress);
        dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(p.tumble * 0.8, p.tumble, 0);
        dummy.scale.setScalar(p.size * (cell.role === "stone" ? 1 - 0.035 * smoothMorph(progress) : cell.role === "blossom" ? 1 - bloom * 0.8 : 1));
        const limbRotation = limbRotations[cell.id];
        if (limbRotation && cell.length) {
          dummy.quaternion.slerp(limbRotation, p.blend);
          dummy.scale.y = 1 + (cell.length - 1) * p.blend;
        }
        dummy.updateMatrix(); cubes.setMatrixAt(cell.id, dummy.matrix);
        cubes.setColorAt(cell.id, tint.copy(flatColors[cell.id]).lerp(grownColors[cell.id], p.blend));
        if (Math.hypot(p.x - cell.flat.x, p.y, p.z - cell.flat.z) > 0.01) displaced++;
      }
      cubes.instanceMatrix.needsUpdate = true;
      if (cubes.instanceColor) cubes.instanceColor.needsUpdate = true;
      fitCamera();
      flowers.visible = bloom > 0;
      if (flowers.visible) {
        blossomMaterial.opacity = bloom;
        flowerCells.forEach((cell, i) => {
          const p = sampleMorphCell(cell, progress);
          flowerRotation.setFromAxisAngle(flowerAxis, p.tumble + cell.shade * Math.PI * 2);
          tint.copy(grownColors[cell.id]).lerp(white, 0.65);
          dummy.position.set(p.x, p.y, p.z);
          dummy.quaternion.copy(camera.quaternion).multiply(flowerRotation);
          dummy.scale.setScalar(p.size * 1.8); dummy.updateMatrix(); flowers.setMatrixAt(i, dummy.matrix);
          flowers.setColorAt(i, tint);
        });
        flowers.instanceMatrix.needsUpdate = true;
        if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
      }
      slab.visible = progress > 0.005;
      renderer.render(scene, camera);
      holder.dataset.progress = progress.toFixed(4);
      holder.dataset.displaced = String(displaced);
      holder.dataset.phase = progress === 0 ? "qr" : progress === 1 ? "tree" : "morphing";
      holder.dataset.scanReady = String(progress === 0);
      holder.dataset.artReady = "true"; holder.dataset.artLook = look;
      holder.dataset.renderCount = String(++frameCount);
      holder.dataset.drawCalls = String(renderer.info.render.calls);
      holder.dataset.triangles = String(renderer.info.render.triangles);
      if (progress !== destination) raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (!raf && !disposed && visible && !document.hidden) { lastTime = performance.now(); raf = requestAnimationFrame(frame); }
    }
    function resize() {
      width = Math.max(1, holder.clientWidth); height = Math.max(1, holder.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2, Math.sqrt(2000000 / (width * height))));
      renderer.setSize(width, height, false); wake();
      holder.dataset.pixelRatio = String(renderer.getPixelRatio());
    }
    const texture = new THREE.TextureLoader().load("/assets/tree/sakura-blossoms-256.webp", t => {
      if (disposed) { t.dispose(); return; }
      t.colorSpace = THREE.SRGBColorSpace; blossomMaterial.map = t; blossomMaterial.needsUpdate = true; wake();
    }, undefined, () => { /* The full voxel tree still works without the optional blossom texture. */ });
    wakeRef.current = wake;
    holder.dataset.cells = String(cells.length);
    holder.dataset.risers = String(cells.filter(c => c.role !== "stone").length);
    holder.dataset.payload = payload;
    holder.dataset.treeHeight = model.height.toFixed(3);

    const observer = new ResizeObserver(resize); observer.observe(holder);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; } else wake();
    });
    intersection.observe(holder);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake(); };
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", wake);
    const touches = new Map<number, { x: number; y: number }>();
    let travel = 0, pinched = false, pinchDistance = 0, pinchZoom = 1;
    const distance = () => { const a = [...touches.values()]; return a.length < 2 ? 0 : Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
    const down = (e: PointerEvent) => {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 1) { travel = 0; pinched = false; }
      if (touches.size === 2) { pinchDistance = distance(); pinchZoom = zoom; pinched = true; }
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const previous = touches.get(e.pointerId); if (!previous) return;
      const dx = e.clientX - previous.x, dy = e.clientY - previous.y;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY }); travel += Math.hypot(dx, dy);
      if (stateRef.current.scanView) return;
      if (touches.size === 2 && pinchDistance) zoom = Math.max(0.7, Math.min(2, pinchZoom * distance() / pinchDistance));
      else if (!pinched) { theta -= dx / width * Math.PI * 2; phi = Math.max(0.28, Math.min(1.3, phi - dy / height * 2)); }
      wake();
    };
    const up = (e: PointerEvent) => {
      if (!touches.has(e.pointerId)) return;
      touches.delete(e.pointerId);
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      if (!touches.size && travel < 6 && !pinched && e.type !== "pointercancel") stateRef.current.onToggleScan?.();
    };
    const wheel = (e: WheelEvent) => { e.preventDefault(); if (stateRef.current.scanView) return; zoom = Math.max(0.7, Math.min(2, zoom * Math.exp(-e.deltaY * 0.001))); wake(); };
    const keyboard = (e: KeyboardEvent) => {
      if (["Enter", " "].includes(e.key)) { e.preventDefault(); stateRef.current.onToggleScan?.(); return; }
      if (e.key === "Escape" && !stateRef.current.scanView) { stateRef.current.onToggleScan?.(); return; }
      if (stateRef.current.scanView) return;
      if (e.key === "ArrowLeft") theta -= 0.15; else if (e.key === "ArrowRight") theta += 0.15;
      else if (e.key === "ArrowUp") phi = Math.max(0.28, phi - 0.1); else if (e.key === "ArrowDown") phi = Math.min(1.3, phi + 0.1);
      else if (e.key === "+" || e.key === "=") zoom = Math.min(2, zoom * 1.1); else if (e.key === "-") zoom = Math.max(0.7, zoom / 1.1); else return;
      e.preventDefault(); wake();
    };
    const lost = (e: Event) => { e.preventDefault(); stateRef.current.onUnsupported?.(); };
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false }); canvas.addEventListener("keydown", keyboard);
    canvas.addEventListener("webglcontextlost", lost);
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(raf); wakeRef.current = null;
      observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", wake);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel); canvas.removeEventListener("keydown", keyboard); canvas.removeEventListener("webglcontextlost", lost);
      texture.dispose(); geometry.dispose(); material.dispose(); cubes.dispose();
      flowers.geometry.dispose(); blossomMaterial.dispose(); flowers.dispose(); slab.geometry.dispose(); slabMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    };
  }, [payload, hits, preview]);

  return <div ref={holderRef} className="tree-grove-stage" data-testid="grove-canvas" data-hits={hits} data-preview={preview} />;
}
