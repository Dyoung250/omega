import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useSceneStore, MATERIALS } from "../stores/sceneStore";

export default function PBRMaterialMesh() {
  const meshRef = useRef<Mesh>(null);
  const activeMaterialId = useSceneStore((s) => s.activeMaterial);
  const material = MATERIALS.find((m) => m.id === activeMaterialId) || MATERIALS[0];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        emissive={material.emissive}
        emissiveIntensity={material.emissiveIntensity}
      />
    </mesh>
  );
}
