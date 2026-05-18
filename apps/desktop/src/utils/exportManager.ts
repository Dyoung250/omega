import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

let sceneRef: THREE.Scene | null = null;
let glRef: THREE.WebGLRenderer | null = null;

export function registerScene(s: THREE.Scene) {
  sceneRef = s;
}
export function registerGL(gl: THREE.WebGLRenderer) {
  glRef = gl;
}

function triggerDownload(data: string | ArrayBuffer, filename: string, mime: string) {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: mime })
      : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportScreenshot(filename = "forgia-screenshot.png") {
  if (!glRef) return;
  const canvas = glRef.domElement;
  glRef.render(sceneRef!, glRef.getRenderTarget() as any);
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportGLTF(options: { binary?: boolean; filename?: string } = {}) {
  const { binary = false, filename = binary ? "forgia-scene.glb" : "forgia-scene.gltf" } = options;
  if (!sceneRef) return;
  const exporter = new GLTFExporter();
  exporter.parse(
    sceneRef,
    (gltf) => {
      if (binary) {
        triggerDownload(gltf as ArrayBuffer, filename, "model/gltf-binary");
      } else {
        const output = JSON.stringify(gltf, null, 2);
        triggerDownload(output, filename, "model/gltf+json");
      }
    },
    (err) => console.error("GLTF export error:", err),
    { binary }
  );
}

export function exportOBJ(filename = "forgia-scene.obj") {
  if (!sceneRef) return;
  const exporter = new OBJExporter();
  const result = exporter.parse(sceneRef);
  triggerDownload(result, filename, "text/plain");
}
