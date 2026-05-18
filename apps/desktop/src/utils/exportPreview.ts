import { supabase } from "../lib/supabase";
import { useObjectStore } from "../stores/objectStore";
import { useCameraStore, CAMERA_PRESETS } from "../stores/cameraStore";
import { MATERIALS } from "../stores/sceneStore";
import { useAuthStore } from "../stores/authStore";

export interface PreviewSceneData {
  objects: Array<{
    defId: string;
    params: Record<string, number | string | boolean>;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
  }>;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  version: string;
  exportedAt: string;
}

export function buildPreviewData(): PreviewSceneData {
  const objects = useObjectStore.getState().objects;
  const activePreset = useCameraStore.getState().activePreset;
  const preset = CAMERA_PRESETS.find((p) => p.id === activePreset) ?? CAMERA_PRESETS[0];

  const serializedObjects = objects.map((obj) => {
    const mat = MATERIALS.find((m) => m.id === obj.material);
    return {
      defId: obj.defId,
      params: obj.params,
      position: obj.transform.position,
      rotation: obj.transform.rotation,
      scale: obj.transform.scale,
      color: mat?.color ?? "#d4a373",
    };
  });

  return {
    objects: serializedObjects,
    camera: {
      position: preset.position,
      target: preset.target,
      fov: preset.fov ?? 45,
    },
    version: "1.0",
    exportedAt: new Date().toISOString(),
  };
}

export async function uploadPreview(
  projectId: string | null,
  sceneData: PreviewSceneData
): Promise<{ id: string; url: string } | null> {
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error("Autenticazione richiesta per esportare la preview");
  }

  const { data, error } = await supabase
    .from("project_previews")
    .insert({
      project_id: projectId,
      owner_id: user.id,
      scene_data: sceneData as any,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Errore durante l'upload della preview");
  }

  const viewerUrl = (import.meta as any).env?.VITE_PREVIEW_BASE_URL ?? "https://spectacular-cat-159420.netlify.app";
  return {
    id: data.id,
    url: `${viewerUrl}/p/${data.id}`,
  };
}
