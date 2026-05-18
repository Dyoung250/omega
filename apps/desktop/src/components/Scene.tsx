import PipelineMesh from "./PipelineMesh";
import DimensionLines from "./DimensionLines";
import { useObjectStore } from "../stores/objectStore";

export default function Scene() {
  const objects = useObjectStore((s) => s.objects);
  const selectedId = useObjectStore((s) => s.selectedId);

  return (
    <group>
      {objects.map((obj) => (
        <PipelineMesh
          key={obj.id}
          obj={obj}
          isSelected={obj.id === selectedId}
        />
      ))}
      <DimensionLines />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#111113" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
}
