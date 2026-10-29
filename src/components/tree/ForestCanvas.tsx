"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { forestHeight, forestPlots, forestTreeModel } from "@/lib/qr-forest";
import { hashUnit, morphColors, type TreeMorph } from "@/lib/qr-tree-morph";
import type { ShortLinkRecord } from "@/lib/short-links-api";

type Props = { trees: ShortLinkRecord[]; selectedCode?: string; onSelect?: (record: ShortLinkRecord) => void; onUnsupported?: () => void };
const SKY = "#edf0e2";

/** A single instanced forest built from the same QR modules, limbs and flowers as /tree. */
export function ForestCanvas({ trees, selectedCode, onSelect, onUnsupported }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ trees, selectedCode, onSelect, onUnsupported });
  const wakeRef = useRef<(() => void) | null>(null);
  const cameraState = useRef({ theta: 0.72, phi: 0.91, zoom: 1 });
  const signature = trees.map(t => [t.code, t.shortUrl, t.season, t.palette].join(":")).sort().join("|");
  useEffect(() => {
    stateRef.current = { trees, selectedCode, onSelect, onUnsupported };
    wakeRef.current?.();
  }, [trees, selectedCode, onSelect, onUnsupported]);

  useEffect(() => {
    const mount = holderRef.current;
    if (!mount) return;
    const holder = mount;
    let disposed = false, cleanup: (() => void) | undefined;
    holder.dataset.ready = "false";
    async function mountForest() {
      const records = [...stateRef.current.trees].sort((a, b) => a.code.localeCompare(b.code));
      const plots = forestPlots(records);
      const source: TreeMorph[] = [];
      // Yield between batches so the controls remain responsive when a whole grove arrives.
      for (let i = 0; i < records.length; i++) {
        source.push(forestTreeModel(records[i].shortUrl));
        if (i % 4 === 3) await new Promise(resolve => setTimeout(resolve, 0));
        if (disposed) return;
      }
      let renderer: THREE.WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
      catch { stateRef.current.onUnsupported?.(); return; }
      renderer.setClearColor(SKY);
      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute("aria-label", "Link forest. Drag to rotate, pinch to zoom, select a tree for its QR. Arrow keys rotate, plus and minus zoom.");
      holder.append(canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
      scene.add(new THREE.HemisphereLight("#fff8e9", "#71875a", 2.1));
      const sunlight = new THREE.DirectionalLight("#fff2d9", 2.2);
      sunlight.position.set(-15, 35, 20); scene.add(sunlight);
      const radius = Math.max(8, ...plots.map(p => Math.hypot(p.x, p.z) + 4));
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.97, 1.35, 64), new THREE.MeshLambertMaterial({ color: "#9d8564" }));
      soil.position.y = -0.76; scene.add(soil);
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.18, 64), new THREE.MeshLambertMaterial({ color: "#a8bd7c" }));
      ground.position.y = -0.07; scene.add(ground);
      const up = new THREE.Vector3(0, 1, 0), white = new THREE.Color("#ffffff");
      const dummy = new THREE.Object3D(), color = new THREE.Color();
      const position = new THREE.Vector3(), rotation = new THREE.Quaternion(), axisZ = new THREE.Vector3(0, 0, 1);
      const planted = records.map((record, i) => {
        const model = source[i], plot = plots[i], height = forestHeight(record.hits);
        const normalization = model.height + 0.47;
        const flora = model.cells.filter(c => c.role === "blossom");
        const canopyRadius = Math.max(...flora.map(c => Math.hypot(c.grown.x, c.grown.z) + c.size * 1.3)) / normalization;
        return { record, model, ...plot, height, target: height, normalization, canopyRadius, yawRotation: new THREE.Quaternion().setFromAxisAngle(up, plot.yaw) };
      });
      const density = Math.max(1, Math.ceil(records.length / 12));
      const limbs: { owner: number; cell: typeof source[number]["cells"][number]; rotation: THREE.Quaternion }[] = [];
      const flowers: { owner: number; cell: typeof source[number]["cells"][number] }[] = [];
      planted.forEach((p, owner) => {
        let blossom = 0;
        for (const cell of p.model.cells) {
          if (cell.role === "wood" && cell.direction) limbs.push({ owner, cell, rotation: new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(cell.direction.x, cell.direction.y, cell.direction.z).normalize()) });
          if (cell.role === "blossom" && blossom++ % density === 0) flowers.push({ owner, cell });
        }
      });
      const wood = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), Math.max(1, limbs.length));
      wood.count = limbs.length; wood.frustumCulled = false; wood.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(wood);
      const flowerMaterial = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.18, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true });
      const blooms = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), flowerMaterial, Math.max(1, flowers.length));
      blooms.count = flowers.length; blooms.frustumCulled = false; blooms.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(blooms);

      // Every clearing carries its actual colored QR, packed into one texture and one draw call.
      const columns = Math.max(1, Math.ceil(Math.sqrt(records.length))), tile = 196;
      const atlas = document.createElement("canvas");
      atlas.width = columns * tile; atlas.height = Math.max(1, Math.ceil(records.length / columns)) * tile;
      const ctx = atlas.getContext("2d")!;
      ctx.fillStyle = "#fcf8f0"; ctx.fillRect(0, 0, atlas.width, atlas.height);
      const vertices: number[] = [], uvs: number[] = [];
      planted.forEach((p, i) => {
        const ox = i % columns * tile, oy = Math.floor(i / columns) * tile;
        const px = Math.floor(tile / p.model.world), inset = (tile - px * p.model.world) / 2;
        for (const cell of p.model.cells) {
          ctx.fillStyle = morphColors(cell, p.model.size, p.record.season, p.record.palette).flat;
          ctx.fillRect(ox + inset + (cell.col + 4) * px, oy + inset + (cell.row + 4) * px, px, px);
        }
        const h = 1.5, u0 = ox / atlas.width, u1 = (ox + tile) / atlas.width, v0 = 1 - (oy + tile) / atlas.height, v1 = 1 - oy / atlas.height;
        vertices.push(p.x - h, 0.04, p.z - h, p.x + h, 0.04, p.z + h, p.x + h, 0.04, p.z - h, p.x - h, 0.04, p.z - h, p.x - h, 0.04, p.z + h, p.x + h, 0.04, p.z + h);
        uvs.push(u0, v1, u1, v0, u1, v1, u0, v1, u0, v0, u1, v0);
      });
      const atlasTexture = new THREE.CanvasTexture(atlas);
      atlasTexture.colorSpace = THREE.SRGBColorSpace; atlasTexture.magFilter = THREE.NearestFilter; atlasTexture.minFilter = THREE.LinearFilter; atlasTexture.generateMipmaps = false;
      const clearingGeometry = new THREE.BufferGeometry();
      clearingGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      clearingGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      const clearings = new THREE.Mesh(clearingGeometry, new THREE.MeshBasicMaterial({ map: atlasTexture, side: THREE.DoubleSide })); scene.add(clearings);

      // Low undergrowth fills the spaces between real trees, without adding fictitious links.
      const details = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial(), 240);
      let detailCount = 0;
      for (let i = 0; i < 600 && detailCount < Math.min(240, 55 + planted.length * 8); i++) {
        const angle = hashUnit(7127, i) * Math.PI * 2, r = Math.sqrt(hashUnit(21391, i)) * (radius - 0.5);
        const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
        if (plots.some(p => Math.abs(p.x - x) < 1.9 && Math.abs(p.z - z) < 1.9)) continue;
        const h = 0.13 + hashUnit(319, i) * 0.36;
        dummy.position.set(x, h * 0.45, z); dummy.rotation.set(0, angle, 0); dummy.scale.set(h * 1.4, h, h); dummy.updateMatrix();
        details.setMatrixAt(detailCount, dummy.matrix); details.setColorAt(detailCount++, color.set(["#6d934c", "#8baa5d", "#c4cf9d", "#e3d9b5"][i % 4]));
      }
      details.count = detailCount; scene.add(details);
      const marker = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.75, 40), new THREE.MeshBasicMaterial({ color: "#b77b37", side: THREE.DoubleSide }));
      marker.rotation.x = -Math.PI / 2; scene.add(marker);

      let raf = 0, visible = true, width = 1, height = 1, frameCount = 0, last = performance.now();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      function frame(now: number) {
        raf = 0;
        if (disposed || !visible || document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const latest = new Map(stateRef.current.trees.map(t => [t.code, t]));
        let growing = false;
        for (const p of planted) {
          const record = latest.get(p.code);
          if (record) { p.record = record; p.target = forestHeight(record.hits); }
          p.height = reduced.matches ? p.target : THREE.MathUtils.damp(p.height, p.target, 6, dt);
          if (Math.abs(p.height - p.target) < 0.002) p.height = p.target; else growing = true;
        }
        const highest = Math.max(3, ...planted.map(p => p.height));
        const view = cameraState.current;
        camera.position.set(Math.sin(view.theta) * Math.sin(view.phi) * 180, Math.cos(view.phi) * 180, Math.cos(view.theta) * Math.sin(view.phi) * 180);
        camera.lookAt(0, highest * 0.28, 0); camera.updateMatrixWorld();
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const bound = (x: number, y: number, z: number) => {
          position.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          minX = Math.min(minX, position.x); maxX = Math.max(maxX, position.x); minY = Math.min(minY, position.y); maxY = Math.max(maxY, position.y);
        };
        for (let i = 0; i < 32; i++) bound(Math.cos(i * Math.PI / 16) * radius, -1.45, Math.sin(i * Math.PI / 16) * radius);
        for (const p of planted) for (const x of [-1, 1]) for (const z of [-1, 1]) bound(p.x + x * p.canopyRadius * p.height, p.height * 1.08, p.z + z * p.canopyRadius * p.height);
        const aspect = width / height, span = Math.max(maxY - minY, (maxX - minX) / aspect) * 1.1 / view.zoom;
        const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
        camera.left = cx - span * aspect / 2; camera.right = cx + span * aspect / 2; camera.top = cy + span / 2; camera.bottom = cy - span / 2; camera.updateProjectionMatrix();
        limbs.forEach(({ owner, cell, rotation: limbRotation }, i) => {
          const p = planted[owner], scale = p.height / p.normalization;
          position.set(cell.grown.x, cell.grown.y + 0.47, cell.grown.z).multiplyScalar(scale).applyQuaternion(p.yawRotation);
          dummy.position.set(p.x + position.x, position.y + 0.06, p.z + position.z);
          dummy.quaternion.copy(p.yawRotation).multiply(limbRotation); dummy.scale.set(cell.size * scale, (cell.length ?? cell.size) * scale, cell.size * scale); dummy.updateMatrix();
          wood.setMatrixAt(i, dummy.matrix); wood.setColorAt(i, color.set(morphColors(cell, p.model.size, p.record.season, p.record.palette).grown));
        });
        flowers.forEach(({ owner, cell }, i) => {
          const p = planted[owner], scale = p.height / p.normalization;
          position.set(cell.grown.x, cell.grown.y + 0.47, cell.grown.z).multiplyScalar(scale).applyQuaternion(p.yawRotation);
          dummy.position.set(p.x + position.x, position.y + 0.06, p.z + position.z);
          rotation.setFromAxisAngle(axisZ, cell.shade * Math.PI * 2);
          dummy.quaternion.copy(camera.quaternion).multiply(rotation);
          dummy.scale.setScalar(cell.size * scale * 1.8 * Math.sqrt(density)); dummy.updateMatrix(); blooms.setMatrixAt(i, dummy.matrix);
          color.set(morphColors(cell, p.model.size, p.record.season, p.record.palette).grown);
          if (p.record.season === "spring") color.lerp(white, 0.42);
          blooms.setColorAt(i, color);
        });
        wood.instanceMatrix.needsUpdate = true; blooms.instanceMatrix.needsUpdate = true;
        wood.boundingSphere = null; blooms.boundingSphere = null;
        if (wood.instanceColor) wood.instanceColor.needsUpdate = true;
        if (blooms.instanceColor) blooms.instanceColor.needsUpdate = true;
        const selected = planted.find(p => p.code === stateRef.current.selectedCode);
        marker.visible = Boolean(selected);
        if (selected) marker.position.set(selected.x, 0.07, selected.z);
        renderer.render(scene, camera);
        holder.dataset.ready = "true"; holder.dataset.renderCount = String(++frameCount); holder.dataset.drawCalls = String(renderer.info.render.calls);
        holder.dataset.growing = String(growing); holder.dataset.selected = selected?.code ?? "";
        holder.dataset.models = JSON.stringify(planted.map(p => ({ code: p.code, payload: p.model.payload, cells: p.model.cells.length, hits: p.record.hits, height: Number(p.height.toFixed(4)), width: Number((p.canopyRadius * p.height * 2).toFixed(4)), x: p.x, z: p.z })));
        if (growing) raf = requestAnimationFrame(frame);
      }
      function wake() { if (!raf && !disposed && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
      function resize() {
        width = Math.max(1, holder!.clientWidth); height = Math.max(1, holder!.clientHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2, Math.sqrt(1800000 / (width * height))));
        renderer.setSize(width, height, false); holder!.dataset.pixelRatio = String(renderer.getPixelRatio()); wake();
      }
      const texture = new THREE.TextureLoader().load("/assets/tree/sakura-blossoms-256.webp", t => {
        if (disposed) { t.dispose(); return; }
        t.colorSpace = THREE.SRGBColorSpace; flowerMaterial.map = t; flowerMaterial.needsUpdate = true; wake();
      });
      wakeRef.current = wake;
      const observer = new ResizeObserver(resize); observer.observe(holder!);
      const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; if (!visible) { cancelAnimationFrame(raf); raf = 0; } else wake(); }); intersection.observe(holder!);
      const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake(); };
      document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", wake);
      const pointers = new Map<number, { x: number; y: number }>();
      let travel = 0, pinched = false, initialDistance = 0, initialZoom = 1;
      const distance = () => { const p = [...pointers.values()]; return p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0; };
      const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
      const pick = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects([wood, blooms, clearings], false)[0];
        const owner = !hit ? undefined : hit.object === wood ? limbs[hit.instanceId!]?.owner : hit.object === blooms ? flowers[hit.instanceId!]?.owner : Math.floor((hit.faceIndex ?? -2) / 2);
        if (owner !== undefined && planted[owner]) stateRef.current.onSelect?.(planted[owner].record);
      };
      const down = (e: PointerEvent) => { pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.size === 1) { travel = 0; pinched = false; } if (pointers.size === 2) { pinched = true; initialDistance = distance(); initialZoom = cameraState.current.zoom; } canvas.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => {
        const prior = pointers.get(e.pointerId); if (!prior) return;
        const dx = e.clientX - prior.x, dy = e.clientY - prior.y; travel += Math.hypot(dx, dy); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const view = cameraState.current;
        if (pointers.size === 2 && initialDistance) view.zoom = THREE.MathUtils.clamp(initialZoom * distance() / initialDistance, 0.65, 3);
        else if (!pinched) { view.theta -= dx / width * Math.PI * 2; view.phi = THREE.MathUtils.clamp(view.phi - dy / height, 0.38, 1.2); } wake();
      };
      const upPointer = (e: PointerEvent) => { if (!pointers.has(e.pointerId)) return; pointers.delete(e.pointerId); if (!pointers.size && !pinched && travel < 6 && e.type !== "pointercancel") pick(e); if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); };
      const wheel = (e: WheelEvent) => { e.preventDefault(); cameraState.current.zoom = THREE.MathUtils.clamp(cameraState.current.zoom * Math.exp(-e.deltaY * 0.001), 0.65, 3); wake(); };
      const keyboard = (e: KeyboardEvent) => {
        const view = cameraState.current;
        if (e.key === "ArrowLeft") view.theta -= 0.15; else if (e.key === "ArrowRight") view.theta += 0.15;
        else if (e.key === "ArrowUp") view.phi = Math.max(0.38, view.phi - 0.1); else if (e.key === "ArrowDown") view.phi = Math.min(1.2, view.phi + 0.1);
        else if (e.key === "+" || e.key === "=") view.zoom = Math.min(3, view.zoom * 1.15); else if (e.key === "-") view.zoom = Math.max(0.65, view.zoom / 1.15);
        else if (e.key === "Escape") { view.theta = 0.72; view.phi = 0.91; view.zoom = 1; } else return;
        e.preventDefault(); wake();
      };
      const lost = (e: Event) => { e.preventDefault(); stateRef.current.onUnsupported?.(); };
      canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", upPointer); canvas.addEventListener("pointercancel", upPointer);
      canvas.addEventListener("wheel", wheel, { passive: false }); canvas.addEventListener("keydown", keyboard); canvas.addEventListener("webglcontextlost", lost);
      resize();
      return () => {
        cancelAnimationFrame(raf); wakeRef.current = null; observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", wake);
        canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", upPointer); canvas.removeEventListener("pointercancel", upPointer);
        canvas.removeEventListener("wheel", wheel); canvas.removeEventListener("keydown", keyboard); canvas.removeEventListener("webglcontextlost", lost);
        texture.dispose(); atlasTexture.dispose();
        scene.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(m => m.dispose()); if (object instanceof THREE.InstancedMesh) object.dispose(); } });
        renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      };
    }
    void mountForest().then(fn => { if (disposed) fn?.(); else cleanup = fn; }).catch(() => stateRef.current.onUnsupported?.());
    return () => { disposed = true; cleanup?.(); };
  }, [signature]);

  return <div ref={holderRef} className="forest-canvas" data-testid="forest-canvas" data-trees={trees.length} />;
}
