import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingIslandProps {
  batteryPercent: number;
  isCharging: boolean;
  cpuLoad: number;
  cpuTemp: number;
}

export const FloatingIsland3D: React.FC<FloatingIslandProps> = ({
  batteryPercent,
  isCharging,
  cpuLoad,
  cpuTemp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ batteryPercent, isCharging, cpuLoad, cpuTemp });

  // Eng so'nggi holatni saqlab turish
  useEffect(() => {
    stateRef.current = { batteryPercent, isCharging, cpuLoad, cpuTemp };
  }, [batteryPercent, isCharging, cpuLoad, cpuTemp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 370;
    const height = container.clientHeight || 240;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080a0f, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 2.2, 4.4);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 4);
    scene.add(dirLight);

    const crystalPointLight = new THREE.PointLight(0x10b981, 3.5, 6);
    crystalPointLight.position.set(0, 0.8, 0);
    scene.add(crystalPointLight);

    // 3. Floating Island Group
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // --- A. Island Rock Base (Pastki konussimon tosh qatlami) ---
    const rockGeo = new THREE.ConeGeometry(1.6, 1.8, 7, 3);
    // Vektorlarni pastga qaratish
    rockGeo.rotateX(Math.PI);
    rockGeo.translate(0, -0.6, 0);

    // Tosh teksturasi uchun unikal rang
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    islandGroup.add(rockMesh);

    // --- B. Island Top Grass / Flora (Ustki yashil maysa qatlami) ---
    const grassGeo = new THREE.CylinderGeometry(1.65, 1.5, 0.35, 7);
    grassGeo.translate(0, 0.18, 0);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.6,
      metalness: 0.05,
      flatShading: true,
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    islandGroup.add(grassMesh);

    // --- C. Mini Deco (Daraxtchalar va billur toshchalar) ---
    const decoGroup = new THREE.Group();
    const treeTrunkGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.3, 5);
    const treeLeavesGeo = new THREE.ConeGeometry(0.25, 0.5, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x452210, roughness: 0.9, flatShading: true });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5, flatShading: true });

    // 3 ta mini archa/daraxt
    const treeCoords = [
      { x: -0.8, z: 0.4, scale: 0.85 },
      { x: 0.9, z: -0.3, scale: 1.1 },
      { x: -0.5, z: -0.7, scale: 0.7 },
    ];
    treeCoords.forEach((c) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
      trunk.position.y = 0.45;
      const leaves = new THREE.Mesh(treeLeavesGeo, leafMat);
      leaves.position.y = 0.75;
      tree.add(trunk);
      tree.add(leaves);
      tree.position.set(c.x, 0.05, c.z);
      tree.scale.setScalar(c.scale);
      decoGroup.add(tree);
    });
    islandGroup.add(decoGroup);

    // --- D. Central Quantum Energy Crystal (Markaziy Kvant Kristali) ---
    const crystalGeo = new THREE.OctahedronGeometry(0.38, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.95,
      flatShading: true,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(0, 0.8, 0);
    islandGroup.add(crystalMesh);

    // Energiya halqasi (Orbital Energy Ring)
    const ringGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    ringMesh.position.set(0, 0.8, 0);
    islandGroup.add(ringMesh);

    // --- E. Zarrachalar tizimi (Living Energy Particles) ---
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.8;
      particlePositions[i * 3 + 1] = Math.random() * 2.2 - 0.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.005;
      particleVelocities[i * 3 + 1] = 0.008 + Math.random() * 0.015;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    islandGroup.add(particles);

    // 4. Interactive Pointer Physics (Sichqoncha bilan nozik tilt)
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const { batteryPercent, isCharging } = stateRef.current;

      // Ranglar metamorfozasi
      let targetColorHex = 0x10b981; // Zangori
      if (batteryPercent <= 20) {
        targetColorHex = 0xef4444; // Qizil xavf
      } else if (batteryPercent <= 40) {
        targetColorHex = 0xf59e0b; // Qahrabo
      } else if (isCharging) {
        targetColorHex = 0x06b6d4; // Zaryad olinayotganda moviy-oltin kvant
      }

      const targetColor = new THREE.Color(targetColorHex);
      crystalMat.color.lerp(targetColor, 0.05);
      crystalMat.emissive.lerp(targetColor, 0.05);
      crystalPointLight.color.lerp(targetColor, 0.05);
      ringMat.color.lerp(targetColor, 0.05);
      particleMat.color.lerp(targetColor, 0.05);

      // Orolning sokin suzishi (Floating Physics)
      islandGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08 - 0.1;

      // Inersiyali burilish
      islandGroup.rotation.y += (targetRotationY + elapsedTime * 0.12 - islandGroup.rotation.y) * 0.04;
      islandGroup.rotation.x += (targetRotationX - islandGroup.rotation.x) * 0.04;

      // Kristal va Halqa aylanishi
      const rotSpeed = isCharging ? 2.5 : 1.0;
      crystalMesh.rotation.y += 0.02 * rotSpeed;
      crystalMesh.rotation.z = Math.sin(elapsedTime * 2) * 0.15;
      ringMesh.rotation.z -= 0.015 * rotSpeed;

      // Zarrachalarning oqimi
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleVelocities[i * 3 + 1] * (isCharging ? 1.8 : 0.8);
        pos[i * 3] += particleVelocities[i * 3];
        pos[i * 3 + 2] += particleVelocities[i * 3 + 2];

        // Agar zarracha orol tepasidan chiqib ketsa, pastdan qayta tug'iladi
        if (pos[i * 3 + 1] > 2.0) {
          pos[i * 3 + 1] = -0.3;
          pos[i * 3] = (Math.random() - 0.5) * 2.2;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[220px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-cosmic-surface/60 to-transparent">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Badge (Zaryad holati indikatori) */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium tracking-wide">
        <span
          className={`w-2 h-2 rounded-full ${
            isCharging
              ? 'bg-emerald-400 animate-ping'
              : batteryPercent <= 20
              ? 'bg-rose-500 animate-pulse'
              : 'bg-emerald-400'
          }`}
        />
        <span className="text-white/80">
          {isCharging ? 'Kvant Zaryadlanish' : 'Avtonom Biosfera'}
        </span>
      </div>

      {/* Zaryad limiti ko'rsatkichi */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/60 font-mono">
        ECO: 80% GUARD
      </div>
    </div>
  );
};
