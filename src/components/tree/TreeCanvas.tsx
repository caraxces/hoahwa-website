"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { resolveTreeColors, type TreePaletteId, type TreeSeason } from "@/content/tree";
import { buildQrTreeLayout, type QrTreeLayout } from "@/lib/qr-tree";

type TreeCanvasProps = {
  payload: string;
  season: TreeSeason;
  palette: TreePaletteId;
  scanView: boolean;
  onToggleScan?: () => void;
  onUnsupported?: () => void;
};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function colorToThree(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (!material) return;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else {
      material.dispose();
    }
  });
}

function buildScene(layout: QrTreeLayout) {
  const voxelGeo = new THREE.BoxGeometry(0.92, 1, 0.92);
  const voxelMat = new THREE.MeshLambertMaterial();
  const voxels = new THREE.InstancedMesh(
    voxelGeo,
    voxelMat,
    layout.voxels.length,
  );
  voxels.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const instanceColors = new Float32Array(layout.voxels.length * 3);
  instanceColors.fill(1);
  voxels.instanceColor = new THREE.InstancedBufferAttribute(instanceColors, 3);
  voxels.castShadow = false;
  voxels.receiveShadow = false;

  const branchGeo = new THREE.CylinderGeometry(1, 1, 1, 6);
  const branchMat = new THREE.MeshLambertMaterial();
  const branches = new THREE.InstancedMesh(
    branchGeo,
    branchMat,
    Math.max(layout.branches.length, 1),
  );
  branches.count = layout.branches.length;

  const blossomGeo = new THREE.IcosahedronGeometry(1, 0);
  const blossomMat = new THREE.MeshLambertMaterial();
  const blossoms = new THREE.InstancedMesh(
    blossomGeo,
    blossomMat,
    Math.max(layout.blossoms.length, 1),
  );
  blossoms.count = layout.blossoms.length;

  const grassGeo = new THREE.BoxGeometry(0.06, 1, 0.06);
  const grassMat = new THREE.MeshLambertMaterial();
  const grass = new THREE.InstancedMesh(
    grassGeo,
    grassMat,
    Math.max(layout.grass.length, 1),
  );
  grass.count = layout.grass.length;

  const petalGeo = new THREE.CircleGeometry(0.09, 5);
  const petalMat = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });
  const petals = new THREE.InstancedMesh(
    petalGeo,
    petalMat,
    Math.max(layout.petals.length, 1),
  );
  petals.count = layout.petals.length;
  petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const dummy = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();

  layout.branches.forEach((branch, i) => {
    dummy.position.set(
      (branch.start.x + branch.end.x) / 2,
      (branch.start.y + branch.end.y) / 2,
      (branch.start.z + branch.end.z) / 2,
    );
    dir.set(
      branch.end.x - branch.start.x,
      branch.end.y - branch.start.y,
      branch.end.z - branch.start.z,
    );
    const length = Math.max(dir.length(), 0.01);
    dummy.scale.set(branch.radius, length, branch.radius);
    dummy.quaternion.setFromUnitVectors(up, dir.normalize());
    dummy.updateMatrix();
    branches.setMatrixAt(i, dummy.matrix);
  });
  branches.instanceMatrix.needsUpdate = true;
  branches.count = layout.branches.length;

  layout.blossoms.forEach((blossom, i) => {
    dummy.quaternion.identity();
    dummy.position.set(
      blossom.position.x,
      blossom.position.y,
      blossom.position.z,
    );
    dummy.scale.setScalar(blossom.size);
    dummy.updateMatrix();
    blossoms.setMatrixAt(i, dummy.matrix);
  });
  blossoms.instanceMatrix.needsUpdate = true;
  blossoms.count = layout.blossoms.length;

  return { voxels, branches, blossoms, grass, petals, dummy };
}

export function TreeCanvas({
  payload,
  season,
  palette,
  scanView,
  onToggleScan,
  onUnsupported,
}: TreeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef(scanView);
  const colorsRef = useRef(resolveTreeColors(season, palette));
  const unsupportedRef = useRef(onUnsupported);

  useEffect(() => {
    scanRef.current = scanView;
  }, [scanView]);

  useEffect(() => {
    colorsRef.current = resolveTreeColors(season, palette);
  }, [season, palette]);

  useEffect(() => {
    unsupportedRef.current = onUnsupported;
  }, [onUnsupported]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!supportsWebGL()) {
      unsupportedRef.current?.();
      return;
    }

    const layout = buildQrTreeLayout(payload);
    const world = layout.world;
    const center = world / 2;

    const scene = new THREE.Scene();
    const hemi = new THREE.HemisphereLight(0xfff2e0, 0x2a2018, 1.05);
    const sun = new THREE.DirectionalLight(0xffe6c8, 1.15);
    sun.position.set(center + world * 0.4, world, center + world * 0.15);
    scene.add(hemi);
    scene.add(sun);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const meshes = buildScene(layout);
    scene.add(meshes.voxels);
    scene.add(meshes.branches);
    scene.add(meshes.blossoms);
    scene.add(meshes.grass);
    scene.add(meshes.petals);

    const color = new THREE.Color();
    const dummy = meshes.dummy;
    let flatten = scanRef.current ? 1 : 0;
    let orbit = 0.35;
    let raf = 0;
    let elapsed = 0;
    let last = performance.now();

    const setFrustum = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h);
      const aspect = w / h;
      const span = lerp(world * 0.72, world * 0.58, flatten);
      const halfY = span;
      const halfX = span * aspect;
      camera.left = -halfX;
      camera.right = halfX;
      camera.top = halfY;
      camera.bottom = -halfY;
      camera.updateProjectionMatrix();
    };

    const placeVoxels = (t: number) => {
      const colors = colorsRef.current;
      const darkA = colorToThree(colors.dark);
      const darkB = colorToThree(colors.darkFlat);
      const lightA = colorToThree(colors.light);
      const lightB = colorToThree(colors.lightFlat);
      layout.voxels.forEach((voxel, i) => {
        const tall = voxel.finder ? 1.05 : 0.82;
        const height = voxel.dark
          ? lerp(tall, 0.2, t)
          : lerp(0.13, 0.08, t);
        dummy.quaternion.identity();
        dummy.position.set(voxel.x + 0.5, height / 2, voxel.z + 0.5);
        dummy.scale.set(lerp(0.92, 1, t) / 0.92, height, lerp(0.92, 1, t) / 0.92);
        dummy.updateMatrix();
        meshes.voxels.setMatrixAt(i, dummy.matrix);
        color.copy(voxel.dark ? darkA : lightA).lerp(voxel.dark ? darkB : lightB, t);
        meshes.voxels.setColorAt(i, color);
      });
      meshes.voxels.instanceMatrix.needsUpdate = true;
      if (meshes.voxels.instanceColor) {
        meshes.voxels.instanceColor.needsUpdate = true;
      }
    };

    const placeGrass = (t: number) => {
      const hide = 1 - Math.min(t * 2.2, 1);
      layout.grass.forEach((blade, i) => {
        dummy.quaternion.identity();
        dummy.position.set(blade.x + 0.5, (blade.h * hide) / 2, blade.z + 0.5);
        dummy.scale.set(1, Math.max(blade.h * hide, 0.001), 1);
        dummy.updateMatrix();
        meshes.grass.setMatrixAt(i, dummy.matrix);
      });
      meshes.grass.instanceMatrix.needsUpdate = true;
      meshes.grass.visible = hide > 0.02;
    };

    const applyFloraColors = () => {
      const colors = colorsRef.current;
      (meshes.branches.material as THREE.MeshLambertMaterial).color.set(
        colors.trunk,
      );
      (meshes.blossoms.material as THREE.MeshLambertMaterial).color.set(
        colors.blossom,
      );
      (meshes.grass.material as THREE.MeshLambertMaterial).color.set(
        colors.grass,
      );
      (meshes.petals.material as THREE.MeshBasicMaterial).color.set(
        colors.petal,
      );
      scene.background = colorToThree(colors.sky);
      scene.fog = new THREE.Fog(colors.fog, world * 1.1, world * 2.4);
      hemi.color.set(colors.light);
      hemi.groundColor.set(colors.dark);
    };

    const placePetals = (time: number, t: number) => {
      const hide = 1 - Math.min(t * 1.8, 1);
      (meshes.petals.material as THREE.MeshBasicMaterial).opacity = hide * 0.9;
      meshes.petals.visible = hide > 0.05;
      if (hide <= 0.05) return;
      layout.petals.forEach((petal, i) => {
        const cycle = (time * petal.speed + petal.phase) % 1;
        const y = petal.origin.y * (1 - cycle);
        dummy.position.set(
          petal.origin.x + Math.sin(time * 1.4 + petal.phase) * petal.drift,
          Math.max(y, 0.12),
          petal.origin.z + Math.cos(time * 1.1 + petal.phase) * petal.drift,
        );
        dummy.scale.setScalar(1);
        dummy.rotation.set(cycle * 4, petal.phase, cycle * 2);
        dummy.updateMatrix();
        meshes.petals.setMatrixAt(i, dummy.matrix);
      });
      meshes.petals.instanceMatrix.needsUpdate = true;
    };

    applyFloraColors();
    placeVoxels(flatten);
    placeGrass(flatten);
    setFrustum();

    const onResize = () => setFrustum();
    window.addEventListener("resize", onResize);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const target = scanRef.current ? 1 : 0;
      flatten += (target - flatten) * Math.min(1, dt * 3.4);
      if (Math.abs(target - flatten) < 0.001) flatten = target;

      if (flatten < 0.85) {
        orbit += dt * 0.12 * (1 - flatten);
      }

      const colors = colorsRef.current;
      scene.background = colorToThree(colors.sky);
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.set(colors.fog);
      }
      (meshes.branches.material as THREE.MeshLambertMaterial).color.set(
        colors.trunk,
      );
      (meshes.blossoms.material as THREE.MeshLambertMaterial).color.set(
        colors.blossom,
      );
      (meshes.grass.material as THREE.MeshLambertMaterial).color.set(
        colors.grass,
      );
      (meshes.petals.material as THREE.MeshBasicMaterial).color.set(
        colors.petal,
      );

      const isoR = world * 0.95;
      const isoY = world * 0.82;
      const isoX = center + Math.cos(orbit) * isoR;
      const isoZ = center + Math.sin(orbit) * isoR;
      const topY = world * 1.7;
      camera.position.set(
        lerp(isoX, center, flatten),
        lerp(isoY, topY, flatten),
        lerp(isoZ, center + 0.001, flatten),
      );
      camera.up.set(0, lerp(1, 0, flatten), lerp(0, -1, flatten));
      camera.lookAt(center, 0.1, center);
      setFrustum();

      const floraHide = 1 - Math.min(flatten * 1.7, 1);
      meshes.branches.visible = floraHide > 0.04;
      meshes.blossoms.visible = floraHide > 0.04;
      (meshes.branches.material as THREE.MeshLambertMaterial).opacity = 1;
      meshes.branches.material.transparent = false;

      placeVoxels(flatten);
      placeGrass(flatten);
      placePetals(elapsed, flatten);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [payload]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 h-full w-full cursor-pointer [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-hidden
      onClick={onToggleScan}
    />
  );
}
