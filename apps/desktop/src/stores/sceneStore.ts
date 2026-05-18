import { create } from "zustand";

export interface PBRMaterial {
  id: string;
  name: string;
  nameIt: string;
  color: string;
  metalness: number;
  roughness: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface HDRIPreset {
  id: string;
  name: string;
  preset: string;
}

export const MATERIALS: PBRMaterial[] = [
  {
    id: "ferro-battuto",
    name: "Wrought Iron",
    nameIt: "Ferro Battuto",
    color: "#3d2b1f",
    metalness: 0.85,
    roughness: 0.45,
  },
  {
    id: "ferro-lucido",
    name: "Polished Iron",
    nameIt: "Ferro Lucido",
    color: "#5a5a5a",
    metalness: 0.98,
    roughness: 0.12,
  },
  {
    id: "vernice-nera",
    name: "Black Paint",
    nameIt: "Vernice Nera",
    color: "#111111",
    metalness: 0.15,
    roughness: 0.55,
  },
  {
    id: "ruggine-patinata",
    name: "Patinated Rust",
    nameIt: "Ruggine Patinata",
    color: "#6b3a1e",
    metalness: 0.6,
    roughness: 0.75,
    emissive: "#3d1f0a",
    emissiveIntensity: 0.05,
  },
  {
    id: "zincato",
    name: "Galvanized",
    nameIt: "Zincato",
    color: "#c0c8d0",
    metalness: 0.92,
    roughness: 0.25,
  },
  {
    id: "ottone-patinato",
    name: "Patinated Brass",
    nameIt: "Ottone Patinato",
    color: "#8b7340",
    metalness: 0.88,
    roughness: 0.35,
  },
  {
    id: "cromo-lucido",
    name: "Chrome",
    nameIt: "Cromo Lucido",
    color: "#e8e8e8",
    metalness: 1.0,
    roughness: 0.05,
  },
  {
    id: "acciaio-ossidato",
    name: "Oxidized Steel",
    nameIt: "Acciaio Ossidato",
    color: "#4a4a4a",
    metalness: 0.75,
    roughness: 0.65,
  },
];

export const HDRI_PRESETS: HDRIPreset[] = [
  { id: "officina", name: "Officina", preset: "warehouse" },
  { id: "esterno", name: "Esterno", preset: "sunset" },
  { id: "studio", name: "Studio", preset: "studio" },
];

export type ViewMode = "3d" | "2d-top" | "ai-scan";

interface SceneState {
  activeMaterial: string;
  activeHDRI: string;
  viewMode: ViewMode;
  snapEnabled: boolean;
  snapSize: number;
  mirrorEnabled: boolean;
  mirrorAxis: "x" | "z";
  dimensionsEnabled: boolean;
  setMaterial: (id: string) => void;
  setHDRI: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSnap: () => void;
  setSnapSize: (size: number) => void;
  toggleMirror: () => void;
  setMirrorAxis: (axis: "x" | "z") => void;
  toggleDimensions: () => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  activeMaterial: "ferro-battuto",
  activeHDRI: "officina",
  viewMode: "3d",
  snapEnabled: true,
  snapSize: 10,
  mirrorEnabled: false,
  mirrorAxis: "x",
  dimensionsEnabled: false,
  setMaterial: (id) => set({ activeMaterial: id }),
  setHDRI: (id) => set({ activeHDRI: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSnap: () => set({ snapEnabled: !get().snapEnabled }),
  setSnapSize: (size) => set({ snapSize: size }),
  toggleMirror: () => set({ mirrorEnabled: !get().mirrorEnabled }),
  setMirrorAxis: (axis) => set({ mirrorAxis: axis }),
  toggleDimensions: () => set({ dimensionsEnabled: !get().dimensionsEnabled }),
}));
