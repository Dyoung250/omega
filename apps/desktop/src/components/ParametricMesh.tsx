import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { SceneObject } from "@forgia/shared";
import { useObjectStore } from "../stores/objectStore";

interface ParametricMeshProps {
  obj: SceneObject;
  isSelected: boolean;
}


function GateGeometry({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 120) / 100;
  const h = Number(params.altezza ?? 200) / 100;
  const s = Number(params.spessore ?? 4) / 1000;
  const spacing = Number(params.spaziatura ?? 12) / 100;
  const bars = Math.max(2, Math.floor(w / spacing));

  return (
    <group>
      {/* Frame */}
      <mesh castShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, s, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[w, s, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[-w / 2 + s / 2, h / 2, 0]}>
        <boxGeometry args={[s, h, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[w / 2 - s / 2, h / 2, 0]}>
        <boxGeometry args={[s, h, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      {/* Vertical bars */}
      {Array.from({ length: bars }).map((_, i) => {
        const x = -w / 2 + (w / (bars - 1)) * i;
        return (
          <mesh key={i} castShadow position={[x, h / 2, 0]}>
            <boxGeometry args={[s, h - s * 2, s]} />
            <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

function GridGeometry({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 100) / 100;
  const h = Number(params.altezza ?? 80) / 100;
  const s = Number(params.spessore ?? 3) / 1000;
  const meshSize = Number(params.maglia ?? 10) / 100;
  const cols = Math.max(2, Math.floor(w / meshSize));
  const rows = Math.max(2, Math.floor(h / meshSize));

  return (
    <group>
      {Array.from({ length: cols }).map((_, i) => (
        <mesh key={`c${i}`} castShadow position={[-w / 2 + (w / (cols - 1)) * i, h / 2, 0]}>
          <boxGeometry args={[s, h, s]} />
          <meshStandardMaterial color="#5a5a5a" metalness={0.98} roughness={0.12} />
        </mesh>
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <mesh key={`r${i}`} castShadow position={[0, (h / (rows - 1)) * i, 0]}>
          <boxGeometry args={[w, s, s]} />
          <meshStandardMaterial color="#5a5a5a" metalness={0.98} roughness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function PanelGeometry({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 200) / 100;
  const h = Number(params.altezza ?? 120) / 100;
  const s = Number(params.spessore ?? 3) / 1000;

  return (
    <group>
      <mesh castShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, s]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      {/* Ornamental circles */}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <mesh key={i} castShadow position={[(-w / 2 + w * t), h * 0.6, s / 2 + 0.01]} rotation={[0, 0, 0]}>
          <torusGeometry args={[h * 0.12, s * 2, 8, 24]} />
          <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function RailingGeometry({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 150) / 100;
  const h = Number(params.altezza ?? 90) / 100;
  const s = Number(params.spessore ?? 2.5) / 1000;
  const barCount = Number(params.barre ?? 5);

  return (
    <group>
      <mesh castShadow position={[0, h, 0]}>
        <boxGeometry args={[w, s, s * 2]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.98} roughness={0.12} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[w, s, s * 2]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.98} roughness={0.12} />
      </mesh>
      {Array.from({ length: barCount }).map((_, i) => {
        const x = -w / 2 + (w / (barCount - 1 || 1)) * i;
        return (
          <mesh key={i} castShadow position={[x, h / 2, 0]}>
            <boxGeometry args={[s, h, s]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.98} roughness={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

function ArchGeometry({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 200) / 100;
  const h = Number(params.altezza ?? 250) / 100;
  const s = Number(params.spessore ?? 5) / 1000;
  const r = Number(params.raggio ?? 100) / 100;

  return (
    <group>
      <mesh castShadow position={[-w / 2 + s / 2, h / 2, 0]}>
        <boxGeometry args={[s, h, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[w / 2 - s / 2, h / 2, 0]}>
        <boxGeometry args={[s, h, s * 2]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
      {/* Arch top approximation with torus segment */}
      <mesh castShadow position={[0, h - r + s, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[r, s * 3, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#3d2b1f" metalness={0.85} roughness={0.45} />
      </mesh>
    </group>
  );
}

function BoxGeometryFallback({ params }: { params: SceneObject["params"] }) {
  const w = Number(params.larghezza ?? 100) / 100;
  const h = Number(params.altezza ?? 100) / 100;
  const d = Number(params.profondita ?? 30) / 100 || 0.3;
  return (
    <mesh castShadow position={[0, h / 2, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#4a4a4a" metalness={0.75} roughness={0.65} />
    </mesh>
  );
}

const GEOMETRY_MAP: Record<string, React.FC<{ params: SceneObject["params"] }>> = {
  "cancello-singolo": GateGeometry,
  "cancello-doppio": GateGeometry,
  "cancello-pedonale": GateGeometry,
  griglia: GridGeometry,
  "pannello-recinzione": PanelGeometry,
  ringhiera: RailingGeometry,
  arco: ArchGeometry,
  parapetto: BoxGeometryFallback,
  "supporto-insegna": BoxGeometryFallback,
  fioriera: BoxGeometryFallback,
};

export default function ParametricMesh({ obj, isSelected }: ParametricMeshProps) {
  const groupRef = useRef<Group>(null);
  const selectObject = useObjectStore((s) => s.selectObject);

  const { position, rotation, scale } = obj.transform;

  useFrame((_, delta) => {
    if (groupRef.current && isSelected) {
      // subtle highlight pulse when selected
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const GeometryComponent = GEOMETRY_MAP[obj.defId] ?? BoxGeometryFallback;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation.map((r) => (r * Math.PI) / 180) as [number, number, number]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        selectObject(obj.id);
      }}
    >
      <GeometryComponent params={obj.params} />
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#c8963e" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
