import { create } from "zustand";

export type ScanStage = "idle" | "uploading" | "processing" | "complete" | "error";

export interface StructuralAnalysis {
  tipo_struttura: string;
  elementi_identificati: string[];
  pattern_geometrico: string;
  simmetria: string;
  dimensioni_stimate: { larghezza: number; altezza: number; profondita: number };
  raccomandazioni_fabbricazione: string[];
  confidence: number;
  source: string;
  metrics?: Record<string, unknown>;
}

export interface LibraryMatch {
  defId: string;
  nameIt: string;
  category: string;
  score: number;
  confidence: number;
  suggestedParams: Record<string, number>;
  paramKeys: string[];
}

export interface ScanResult {
  id: string;
  name: string;
  estimatedDimensions: { width: number; height: number; depth: number };
  estimatedWeight: number;
  confidence: number;
  thumbnail: string;
  pointCount: number;
  meshUrl?: string;
  processedImage?: string;
  svgContent?: string;
  structuralAnalysis?: StructuralAnalysis;
  libraryMatch?: LibraryMatch;
}

interface AIScanState {
  stage: ScanStage;
  progress: number;
  currentFile: string | null;
  results: ScanResult[];
  selectedResultId: string | null;
  sidecarAvailable: boolean | null;
  sidecarError: string | null;
  setStage: (stage: ScanStage) => void;
  setProgress: (progress: number) => void;
  setCurrentFile: (name: string | null) => void;
  addResult: (result: ScanResult) => void;
  removeResult: (id: string) => void;
  selectResult: (id: string | null) => void;
  updateResult: (id: string, patch: Partial<ScanResult>) => void;
  setSidecarStatus: (available: boolean, error: string | null) => void;
  reset: () => void;
}

export const useAIScanStore = create<AIScanState>((set) => ({
  stage: "idle",
  progress: 0,
  currentFile: null,
  results: [],
  selectedResultId: null,
  sidecarAvailable: null,
  sidecarError: null,
  setStage: (stage) => set({ stage }),
  setProgress: (progress) => set({ progress }),
  setCurrentFile: (currentFile) => set({ currentFile }),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),
  removeResult: (id) => set((state) => ({
    results: state.results.filter((r) => r.id !== id),
    selectedResultId: state.selectedResultId === id ? null : state.selectedResultId,
  })),
  selectResult: (id) => set({ selectedResultId: id }),
  updateResult: (id, patch) => set((state) => ({
    results: state.results.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  })),
  setSidecarStatus: (available, error) => set({ sidecarAvailable: available, sidecarError: error }),
  reset: () => set({ stage: "idle", progress: 0, currentFile: null }),
}));
