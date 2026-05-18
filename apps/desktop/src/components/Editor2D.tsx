import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { useObjectStore } from "../stores/objectStore";
import { useSceneStore } from "../stores/sceneStore";

function snapValue(value: number, snapSize: number): number {
  return Math.round(value / snapSize) * snapSize;
}

interface PlanViewObjProps {
  obj: ReturnType<typeof useObjectStore.getState>["objects"][0];
  isSelected: boolean;
  onDrag: (pos: [number, number, number]) => void;
}

function PlanViewObj({ obj, isSelected, onDrag }: PlanViewObjProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, z: 0 });
  const objStartRef = useRef({ x: 0, z: 0 });

  const w = Number(obj.params.larghezza ?? 100) / 100;
  const h = Number(obj.params.altezza ?? 100) / 100;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.point.x, z: e.point.z };
    objStartRef.current = { x: obj.transform.position[0], z: obj.transform.position[2] };
    useObjectStore.getState().selectObject(obj.id);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const dx = e.point.x - dragStartRef.current.x;
    const dz = e.point.z - dragStartRef.current.z;
    const newX = objStartRef.current.x + dx;
    const newZ = objStartRef.current.z + dz;
    onDrag([newX, obj.transform.position[1], newZ]);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useFrame(() => {
    if (meshRef.current && isSelected) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 + Math.sin(Date.now() * 0.003) * 0.2;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[obj.transform.position[0], 0.01, obj.transform.position[2]]}
      rotation={[-Math.PI / 2, 0, (obj.transform.rotation[1] * Math.PI) / 180]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        color={isSelected ? "#c8963e" : "#5a5a5a"}
        transparent
        opacity={isSelected ? 0.8 : 0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function MirrorGhost({
  obj,
  axis,
}: {
  obj: ReturnType<typeof useObjectStore.getState>["objects"][0];
  axis: "x" | "z";
}) {
  const w = Number(obj.params.larghezza ?? 100) / 100;
  const h = Number(obj.params.altezza ?? 100) / 100;
  const mirrorPos: [number, number, number] = [
    axis === "x" ? -obj.transform.position[0] : obj.transform.position[0],
    obj.transform.position[1],
    axis === "z" ? -obj.transform.position[2] : obj.transform.position[2],
  ];

  return (
    <mesh
      position={[mirrorPos[0], 0.005, mirrorPos[2]]}
      rotation={[-Math.PI / 2, 0, (obj.transform.rotation[1] * Math.PI) / 180]}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        color="#c8963e"
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}

function Scene2D() {
  const objects = useObjectStore((s) => s.objects);
  const selectedId = useObjectStore((s) => s.selectedId);
  const updateTransform = useObjectStore((s) => s.updateTransform);
  const snapEnabled = useSceneStore((s) => s.snapEnabled);
  const snapSize = useSceneStore((s) => s.snapSize);
  const mirrorEnabled = useSceneStore((s) => s.mirrorEnabled);
  const mirrorAxis = useSceneStore((s) => s.mirrorAxis);

  const handleDrag = (objId: string, pos: [number, number, number]) => {
    const snap = snapSize / 100;
    const finalPos: [number, number, number] = [
      snapEnabled ? snapValue(pos[0], snap) : pos[0],
      pos[1],
      snapEnabled ? snapValue(pos[2], snap) : pos[2],
    ];
    updateTransform(objId, "position", 0, finalPos[0]);
    updateTransform(objId, "position", 2, finalPos[2]);
  };

  return (
    <group>
      <ambientLight intensity={1} />
      {objects.map((obj) => (
        <PlanViewObj
          key={obj.id}
          obj={obj}
          isSelected={obj.id === selectedId}
          onDrag={(pos) => handleDrag(obj.id, pos)}
        />
      ))}
      {mirrorEnabled &&
        objects.map((obj) => (
          <MirrorGhost key={`mirror-${obj.id}`} obj={obj} axis={mirrorAxis} />
        ))}
      <Grid
        infiniteGrid
        cellSize={snapSize / 100}
        cellThickness={0.3}
        cellColor="#3a3a42"
        sectionSize={1}
        sectionThickness={0.8}
        sectionColor="#2e2e34"
        fadeDistance={50}
        fadeStrength={1}
        position={[0, 0, 0]}
        args={[50, 50]}
      />
    </group>
  );
}

export default function Editor2D() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 10, 0], zoom: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      className="w-full h-full"
      style={{ background: "#111113" }}
    >
      <color attach="background" args={["#111113"]} />
      <Scene2D />
    </Canvas>
  );
}
