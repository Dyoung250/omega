import { create } from "zustand";

export type CameraMode = "orbit" | "fly";

export interface CameraPreset {
  id: string;
  name: string;
  nameIt: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: "showroom",
    name: "Showroom",
    nameIt: "Showroom",
    position: [3, 2, 3],
    target: [0, 0.5, 0],
    fov: 35,
  },
  {
    id: "cantiere",
    name: "Worksite",
    nameIt: "Cantiere",
    position: [5, 4, 5],
    target: [0, 0, 0],
    fov: 50,
  },
  {
    id: "dettaglio",
    name: "Detail",
    nameIt: "Dettaglio",
    position: [0.8, 0.8, 0.8],
    target: [0, 0.5, 0],
    fov: 25,
  },
  {
    id: "frontale",
    name: "Front",
    nameIt: "Frontale",
    position: [0, 1.5, 4],
    target: [0, 1, 0],
    fov: 40,
  },
  {
    id: "laterale",
    name: "Side",
    nameIt: "Laterale",
    position: [4, 1.5, 0],
    target: [0, 1, 0],
    fov: 40,
  },
];

interface CameraState {
  mode: CameraMode;
  activePreset: string | null;
  setMode: (mode: CameraMode) => void;
  applyPreset: (presetId: string) => void;
  clearPreset: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  mode: "orbit",
  activePreset: null,
  setMode: (mode) => set({ mode, activePreset: null }),
  applyPreset: (presetId) => set({ activePreset: presetId }),
  clearPreset: () => set({ activePreset: null }),
}));
