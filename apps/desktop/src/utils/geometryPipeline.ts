import * as THREE from "three";

/**
 * Pipeline 2D → 3D per elementi parametrici in ferro battuto.
 *
 * Sweep: profilo 2D (sezione) estruso lungo un percorso 3D.
 * Extrude: forma 2D estrusa in profondità.
 * Instancing: rendering GPU di elementi ripetuti (sbarre, griglie).
 */

// ─── Profili di sezione trasversale (mm → unità interne = m) ───────────────

export interface SectionProfile {
  width: number;  // mm
  height: number; // mm
}

export function rectProfile(wMm: number, hMm: number): THREE.Shape {
  const w = wMm / 1000;
  const h = hMm / 1000;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(w / 2, -h / 2);
  shape.lineTo(w / 2, h / 2);
  shape.lineTo(-w / 2, h / 2);
  shape.lineTo(-w / 2, -h / 2);
  return shape;
}

export function roundProfile(diameterMm: number): THREE.Shape {
  const r = (diameterMm / 1000) / 2;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  return shape;
}

// ─── Sweep: estrusione di un profilo lungo un percorso ────────────────────────

export function sweepAlongPath(
  profile: THREE.Shape,
  path: THREE.Curve<THREE.Vector3>,
  tubularSegments = 64
): THREE.BufferGeometry {
  return new THREE.ExtrudeGeometry(profile, {
    steps: tubularSegments,
    extrudePath: path,
    bevelEnabled: false,
  });
}

// ─── Extrude: estrusione lineare di una forma 2D ──────────────────────────────

export function extrudeShape(
  shape: THREE.Shape,
  depth: number
): THREE.ExtrudeGeometry {
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
  });
}

// ─── Tube: tubo generato da una curva (wrap di un cerchio lungo path) ───────

export function tubeFromCurve(
  path: THREE.Curve<THREE.Vector3>,
  radiusMm: number,
  tubularSegments = 64,
  radialSegments = 8
): THREE.TubeGeometry {
  const r = radiusMm / 1000;
  return new THREE.TubeGeometry(path, tubularSegments, r, radialSegments, false);
}

// ─── Instanced Bar: sbarra verticale o orizzontale (box o cilindro) ─────────

export function barGeometry(
  section: "square" | "round",
  sizeMm: number,
  lengthM: number
): THREE.BufferGeometry {
  if (section === "round") {
    const r = (sizeMm / 1000) / 2;
    return new THREE.CylinderGeometry(r, r, lengthM, 8, 1);
  }
  const s = sizeMm / 1000;
  return new THREE.BoxGeometry(s, lengthM, s);
}

// ─── GPU Instanced Mesh builder ──────────────────────────────────────────────

export interface InstanceData {
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

export function buildInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  instances: InstanceData[]
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, instances.length);
  const dummy = new THREE.Object3D();

  instances.forEach((inst, i) => {
    dummy.position.copy(inst.position);
    if (inst.rotation) dummy.rotation.copy(inst.rotation);
    if (inst.scale) dummy.scale.copy(inst.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

// ─── Curva arco (semicerchio) ────────────────────────────────────────────────

export function archCurve(
  widthM: number,
  heightM: number,
  radiusM: number
): THREE.CubicBezierCurve3 {
  const halfW = widthM / 2;
  const topY = heightM - radiusM;
  return new THREE.CubicBezierCurve3(
    new THREE.Vector3(-halfW, topY, 0),
    new THREE.Vector3(-halfW, topY + radiusM, 0),
    new THREE.Vector3(halfW, topY + radiusM, 0),
    new THREE.Vector3(halfW, topY, 0)
  );
}

// ─── Materiale PBR condiviso (factory) ──────────────────────────────────────

export function createPBRMaterial(
  color: string,
  metalness: number,
  roughness: number,
  emissive?: string,
  emissiveIntensity?: number
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
  });
}
