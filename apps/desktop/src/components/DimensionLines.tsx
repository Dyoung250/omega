import { useMemo } from "react";
import { useObjectStore } from "../stores/objectStore";
import { useSceneStore } from "../stores/sceneStore";
import { PARAMETRIC_LIBRARY } from "../stores/libraryStore";
import * as THREE from "three";

function DimLine({
  start,
  end,
  label,
  color = "#c8963e",
}: {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  color?: string;
}) {
  const { points, mid, len } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const d = new THREE.Vector3().subVectors(e, s);
    const l = d.length();
    const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    return { points: [s, e], mid: m, len: l };
  }, [start, end]);

  if (len < 0.01) return null;

  // Offset label slightly above the midpoint
  const labelPos: [number, number, number] = [mid.x, mid.y + 0.15, mid.z];

  return (
    <group>
      {/* Main line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([points[0].x, points[0].y, points[0].z, points[1].x, points[1].y, points[1].z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
      {/* Extension tick marks */}
      {[points[0], points[1]].map((p, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                p.x, p.y - 0.06, p.z,
                p.x, p.y + 0.06, p.z,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} />
        </line>
      ))}
      {/* Label */}
      <sprite position={labelPos} scale={[label.length * 0.04 + 0.3, 0.18, 1]}>
        <spriteMaterial
          transparent
          depthTest={false}
          depthWrite={false}
        >
          <canvasTexture
            attach="map"
            image={(() => {
              const canvas = document.createElement("canvas");
              canvas.width = 256;
              canvas.height = 64;
              const ctx = canvas.getContext("2d")!;
              ctx.fillStyle = "rgba(10,10,11,0.85)";
              ctx.fillRect(0, 0, 256, 64);
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.strokeRect(0, 0, 256, 64);
              ctx.fillStyle = color;
              ctx.font = "bold 22px monospace";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(label, 128, 32);
              return canvas;
            })()}
          />
        </spriteMaterial>
      </sprite>
    </group>
  );
}

export default function DimensionLines() {
  const dimensionsEnabled = useSceneStore((s) => s.dimensionsEnabled);
  const objects = useObjectStore((s) => s.objects);
  const selectedId = useObjectStore((s) => s.selectedId);

  if (!dimensionsEnabled) return null;

  const dims: Array<{ start: [number, number, number]; end: [number, number, number]; label: string; color: string }> = [];

  for (const obj of objects) {
    const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
    if (!def) continue;

    const [px, py, pz] = obj.transform.position;
    const larghezza = Number(obj.params.larghezza ?? def.defaultParams.larghezza ?? 0) / 100;
    const altezza = Number(obj.params.altezza ?? def.defaultParams.altezza ?? 0) / 100;
    const profondita = Number(obj.params.profondita ?? def.defaultParams.profondita ?? 0) / 100;
    const isSelected = obj.id === selectedId;
    const color = isSelected ? "#c8963e" : "#5a5a5a";

    // Width dimension (X-axis)
    if (larghezza > 0) {
      dims.push({
        start: [px - larghezza / 2, py, pz + profondita / 2 + 0.3],
        end: [px + larghezza / 2, py, pz + profondita / 2 + 0.3],
        label: `${(larghezza * 100).toFixed(0)} cm`,
        color,
      });
    }

    // Height dimension (Y-axis) — only for selected
    if (isSelected && altezza > 0) {
      dims.push({
        start: [px + larghezza / 2 + 0.3, py, pz],
        end: [px + larghezza / 2 + 0.3, py + altezza, pz],
        label: `${(altezza * 100).toFixed(0)} cm`,
        color,
      });
    }

    // Depth dimension (Z-axis) — only for selected
    if (isSelected && profondita > 0) {
      dims.push({
        start: [px - larghezza / 2 - 0.3, py, pz - profondita / 2],
        end: [px - larghezza / 2 - 0.3, py, pz + profondita / 2],
        label: `${(profondita * 100).toFixed(0)} cm`,
        color,
      });
    }
  }

  return (
    <group>
      {dims.map((d, i) => (
        <DimLine key={i} start={d.start} end={d.end} label={d.label} color={d.color} />
      ))}
    </group>
  );
}
