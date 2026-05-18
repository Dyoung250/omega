import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SceneObject } from "@forgia/shared";
import { useObjectStore } from "../stores/objectStore";
import { MATERIALS } from "../stores/sceneStore";
import {
  rectProfile,
  sweepAlongPath,
  tubeFromCurve,
  barGeometry,
  buildInstancedMesh,
  archCurve,
  createPBRMaterial,
  type InstanceData,
} from "../utils/geometryPipeline";

interface PipelineMeshProps {
  obj: SceneObject;
  isSelected: boolean;
}

function getMaterial(materialId: string) {
  const mat = MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[0];
  return createPBRMaterial(
    mat.color,
    mat.metalness,
    mat.roughness,
    mat.emissive,
    mat.emissiveIntensity
  );
}

// ─── Cancello (Gate) ─────────────────────────────────────────────────────────
function GatePipeline({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 120) / 100;
  const h = Number(obj.params.altezza ?? 200) / 100;
  const s = Number(obj.params.spessore ?? 4);
  const spacing = Number(obj.params.spaziatura ?? 12) / 100;
  const bars = Math.max(2, Math.floor(w / spacing));

  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  // --- Sweep per i montanti orizzontali (top & bottom rails) ---
  const hProfile = rectProfile(s, s * 2);
  const topPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2, h, 0),
    new THREE.Vector3(w / 2, h, 0)
  );
  const botPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2, 0.05, 0),
    new THREE.Vector3(w / 2, 0.05, 0)
  );
  const topGeo = sweepAlongPath(hProfile, topPath, 32);
  const botGeo = sweepAlongPath(hProfile.clone(), botPath, 32);

  // --- Sweep per i montanti verticali laterali ---
  const vProfile = rectProfile(s * 2, s);
  const leftPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2 + s / 2000, 0.05, 0),
    new THREE.Vector3(-w / 2 + s / 2000, h, 0)
  );
  const rightPath = new THREE.LineCurve3(
    new THREE.Vector3(w / 2 - s / 2000, 0.05, 0),
    new THREE.Vector3(w / 2 - s / 2000, h, 0)
  );
  const leftGeo = sweepAlongPath(vProfile, leftPath, 32);
  const rightGeo = sweepAlongPath(vProfile.clone(), rightPath, 32);

  // --- GPU Instancing per le sbarre verticali ---
  const barGeo = barGeometry("square", s, h - 0.1);
  const barInstances: InstanceData[] = Array.from({ length: bars }).map((_, i) => {
    const x = -w / 2 + (w / (bars - 1)) * i;
    return {
      position: new THREE.Vector3(x, h / 2, 0),
    };
  });
  const barsMesh = useMemo(
    () => buildInstancedMesh(barGeo, material.clone(), barInstances),
    [barGeo, material, bars, w, h]
  );

  return (
    <group>
      <mesh geometry={topGeo} material={material} castShadow />
      <mesh geometry={botGeo} material={material} castShadow />
      <mesh geometry={leftGeo} material={material} castShadow />
      <mesh geometry={rightGeo} material={material} castShadow />
      <primitive object={barsMesh} castShadow />
    </group>
  );
}

// ─── Griglia (Grid) ──────────────────────────────────────────────────────────
function GridPipeline({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 100) / 100;
  const h = Number(obj.params.altezza ?? 80) / 100;
  const s = Number(obj.params.spessore ?? 3);
  const meshSize = Number(obj.params.maglia ?? 10) / 100;
  const cols = Math.max(2, Math.floor(w / meshSize));
  const rows = Math.max(2, Math.floor(h / meshSize));

  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  // --- Instanced vertical bars ---
  const vBarGeo = barGeometry("square", s, h);
  const vInstances: InstanceData[] = Array.from({ length: cols }).map((_, i) => ({
    position: new THREE.Vector3(-w / 2 + (w / (cols - 1)) * i, h / 2, 0),
  }));
  const vMesh = useMemo(
    () => buildInstancedMesh(vBarGeo, material.clone(), vInstances),
    [vBarGeo, material, cols, w, h]
  );

  // --- Instanced horizontal bars ---
  const hBarGeo = barGeometry("square", s, w);
  const hInstances: InstanceData[] = Array.from({ length: rows }).map((_, i) => ({
    position: new THREE.Vector3(0, (h / (rows - 1)) * i, 0),
    rotation: new THREE.Euler(0, 0, Math.PI / 2),
  }));
  const hMesh = useMemo(
    () => buildInstancedMesh(hBarGeo, material.clone(), hInstances),
    [hBarGeo, material, rows, w, h]
  );

  return (
    <group>
      <primitive object={vMesh} castShadow />
      <primitive object={hMesh} castShadow />
    </group>
  );
}

// ─── Pannello Recinzione (Fence Panel) ───────────────────────────────────────
function PanelPipeline({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 200) / 100;
  const h = Number(obj.params.altezza ?? 120) / 100;
  const s = Number(obj.params.spessore ?? 3);

  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  // --- Main panel (box) ---
  const panelGeo = new THREE.BoxGeometry(w, h, s / 1000);

  // --- Ornamental circles (torus) ---
  const circleGeo = new THREE.TorusGeometry(h * 0.12, (s / 1000) * 2, 8, 24);
  const circleInstances: InstanceData[] = [0.25, 0.5, 0.75].map((t) => ({
    position: new THREE.Vector3(-w / 2 + w * t, h * 0.6, (s / 1000) / 2 + 0.005),
  }));
  const circlesMesh = useMemo(
    () => buildInstancedMesh(circleGeo, material.clone(), circleInstances),
    [circleGeo, material, w, h]
  );

  return (
    <group>
      <mesh geometry={panelGeo} material={material} castShadow position={[0, h / 2, 0]} />
      <primitive object={circlesMesh} castShadow />
    </group>
  );
}

// ─── Ringhiera (Railing) ─────────────────────────────────────────────────────
function RailingPipeline({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 150) / 100;
  const h = Number(obj.params.altezza ?? 90) / 100;
  const s = Number(obj.params.spessore ?? 2.5);
  const barCount = Number(obj.params.barre ?? 5);

  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  // --- Top & bottom rails (sweep) ---
  const railProfile = rectProfile(s, s * 2);
  const topPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2, h, 0),
    new THREE.Vector3(w / 2, h, 0)
  );
  const botPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2, 0.05, 0),
    new THREE.Vector3(w / 2, 0.05, 0)
  );
  const topGeo = sweepAlongPath(railProfile, topPath, 32);
  const botGeo = sweepAlongPath(railProfile.clone(), botPath, 32);

  // --- Instanced vertical bars ---
  const barGeo = barGeometry("square", s, h);
  const barInstances: InstanceData[] = Array.from({ length: barCount }).map((_, i) => ({
    position: new THREE.Vector3(-w / 2 + (w / (barCount - 1 || 1)) * i, h / 2, 0),
  }));
  const barsMesh = useMemo(
    () => buildInstancedMesh(barGeo, material.clone(), barInstances),
    [barGeo, material, barCount, w, h]
  );

  return (
    <group>
      <mesh geometry={topGeo} material={material} castShadow />
      <mesh geometry={botGeo} material={material} castShadow />
      <primitive object={barsMesh} castShadow />
    </group>
  );
}

// ─── Arco (Arch) ─────────────────────────────────────────────────────────────
function ArchPipeline({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 200) / 100;
  const h = Number(obj.params.altezza ?? 250) / 100;
  const s = Number(obj.params.spessore ?? 5);
  const r = Number(obj.params.raggio ?? 100) / 100;

  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  // --- Two vertical posts (sweep) ---
  const postProfile = rectProfile(s * 2, s * 2);
  const leftPath = new THREE.LineCurve3(
    new THREE.Vector3(-w / 2 + s / 2000, 0.05, 0),
    new THREE.Vector3(-w / 2 + s / 2000, h - r + s / 1000, 0)
  );
  const rightPath = new THREE.LineCurve3(
    new THREE.Vector3(w / 2 - s / 2000, 0.05, 0),
    new THREE.Vector3(w / 2 - s / 2000, h - r + s / 1000, 0)
  );
  const leftGeo = sweepAlongPath(postProfile, leftPath, 32);
  const rightGeo = sweepAlongPath(postProfile.clone(), rightPath, 32);

  // --- Arch top (tube along curve) ---
  const curve = archCurve(w, h, r);
  const archGeo = tubeFromCurve(curve, s, 64, 8);

  return (
    <group>
      <mesh geometry={leftGeo} material={material} castShadow />
      <mesh geometry={rightGeo} material={material} castShadow />
      <mesh geometry={archGeo} material={material} castShadow />
    </group>
  );
}

// ─── Fallback Box (per elementi senza pipeline dedicata) ─────────────────────
function BoxFallback({ obj }: { obj: SceneObject }) {
  const w = Number(obj.params.larghezza ?? 100) / 100;
  const h = Number(obj.params.altezza ?? 100) / 100;
  const d = Number(obj.params.profondita ?? 30) / 100 || 0.3;
  const material = useMemo(() => getMaterial(obj.material), [obj.material]);

  return (
    <mesh position={[0, h / 2, 0]} castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
      />
    </mesh>
  );
}

// ─── Mappa definizione → componente pipeline ──────────────────────────────────
const PIPELINE_MAP: Record<string, React.FC<{ obj: SceneObject }>> = {
  "cancello-singolo": GatePipeline,
  "cancello-doppio": GatePipeline,
  "cancello-pedonale": GatePipeline,
  griglia: GridPipeline,
  "pannello-recinzione": PanelPipeline,
  ringhiera: RailingPipeline,
  arco: ArchPipeline,
  parapetto: BoxFallback,
  "supporto-insegna": BoxFallback,
  fioriera: BoxFallback,
};

// ─── Componente wrapper con selezione ─────────────────────────────────────────
export default function PipelineMesh({ obj, isSelected }: PipelineMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const selectObject = useObjectStore((s) => s.selectObject);
  const { position, rotation, scale } = obj.transform;

  useFrame((_, delta) => {
    if (groupRef.current && isSelected) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const Component = PIPELINE_MAP[obj.defId] ?? BoxFallback;

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
      <Component obj={obj} />
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#c8963e" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
