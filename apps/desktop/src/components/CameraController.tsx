import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls } from "@react-three/drei";
import * as THREE from "three";
import { useCameraStore, CAMERA_PRESETS } from "../stores/cameraStore";

function PresetAnimator() {
  const { camera } = useThree();
  const activePreset = useCameraStore((s) => s.activePreset);
  const clearPreset = useCameraStore((s) => s.clearPreset);
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const startPosRef = useRef<THREE.Vector3 | null>(null);
  const startFovRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!activePreset) return;
    const preset = CAMERA_PRESETS.find((p) => p.id === activePreset);
    if (!preset) return;

    startPosRef.current = camera.position.clone();
    targetRef.current = new THREE.Vector3(...preset.position);
    startFovRef.current = (camera as THREE.PerspectiveCamera).fov;
    progressRef.current = 0;
    isAnimatingRef.current = true;
  }, [activePreset, camera]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current || !targetRef.current || !startPosRef.current) return;

    progressRef.current += delta * 2.5; // animation speed
    const t = Math.min(progressRef.current, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic

    camera.position.lerpVectors(startPosRef.current, targetRef.current, eased);

    if (startFovRef.current !== null) {
      const preset = CAMERA_PRESETS.find((p) => p.id === activePreset);
      if (preset?.fov) {
        const newFov = startFovRef.current + (preset.fov - startFovRef.current) * eased;
        (camera as THREE.PerspectiveCamera).fov = newFov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }

    if (t >= 1) {
      isAnimatingRef.current = false;
      clearPreset();
    }
  });

  return null;
}

export default function CameraController() {
  const mode = useCameraStore((s) => s.mode);
  const orbitRef = useRef<any>(null);
  const flyRef = useRef<any>(null);

  useEffect(() => {
    if (mode === "orbit" && orbitRef.current) {
      orbitRef.current.reset();
    }
  }, [mode]);

  return (
    <>
      <PresetAnimator />
      {mode === "orbit" ? (
        <OrbitControls
          ref={orbitRef}
          makeDefault
          enablePan
          enableZoom
          enableRotate
          minDistance={0.5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
      ) : (
        <FlyControls
          ref={flyRef}
          makeDefault
          movementSpeed={3}
          rollSpeed={0.5}
          dragToLook={true}
        />
      )}
    </>
  );
}
