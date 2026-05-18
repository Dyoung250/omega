import { create } from "zustand";
import { SceneObject, ParametricDef } from "@forgia/shared";

interface ObjectState {
  objects: SceneObject[];
  selectedId: string | null;
  addObject: (def: ParametricDef, materialId: string) => void;
  addObjects: (items: Array<{ def: ParametricDef; materialId: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number]; params?: Record<string, number | string | boolean> }>) => void;
  removeObject: (id: string) => void;
  clearScene: () => void;
  selectObject: (id: string | null) => void;
  updateTransform: (
    id: string,
    key: "position" | "rotation" | "scale",
    axis: number,
    value: number
  ) => void;
  updateParam: (id: string, key: string, value: number | string | boolean) => void;
  updateMaterial: (id: string, materialId: string) => void;
}

let idCounter = 0;
function genId(): string {
  return `obj-${++idCounter}`;
}

export const useObjectStore = create<ObjectState>((set, get) => ({
  objects: [],
  selectedId: null,

  addObject: (def, materialId) => {
    const obj: SceneObject = {
      id: genId(),
      defId: def.id,
      name: def.nameIt,
      params: { ...def.defaultParams },
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      material: materialId,
    };
    set({ objects: [...get().objects, obj], selectedId: obj.id });
  },

  addObjects: (items) => {
    const newObjects: SceneObject[] = items.map((item) => ({
      id: genId(),
      defId: item.def.id,
      name: item.def.nameIt,
      params: { ...item.def.defaultParams, ...item.params },
      transform: {
        position: item.position ?? [0, 0, 0],
        rotation: item.rotation ?? [0, 0, 0],
        scale: item.scale ?? [1, 1, 1],
      },
      material: item.materialId,
    }));
    set({ objects: [...get().objects, ...newObjects], selectedId: newObjects[newObjects.length - 1]?.id ?? get().selectedId });
  },

  clearScene: () => set({ objects: [], selectedId: null }),

  removeObject: (id) => {
    set({
      objects: get().objects.filter((o) => o.id !== id),
      selectedId: get().selectedId === id ? null : get().selectedId,
    });
  },

  selectObject: (id) => set({ selectedId: id }),

  updateTransform: (id, key, axis, value) => {
    set({
      objects: get().objects.map((o) =>
        o.id === id
          ? {
              ...o,
              transform: {
                ...o.transform,
                [key]: o.transform[key].map((v: number, i: number) =>
                  i === axis ? value : v
                ) as [number, number, number],
              },
            }
          : o
      ),
    });
  },

  updateParam: (id, key, value) => {
    set({
      objects: get().objects.map((o) =>
        o.id === id ? { ...o, params: { ...o.params, [key]: value } } : o
      ),
    });
  },

  updateMaterial: (id, materialId) => {
    set({
      objects: get().objects.map((o) =>
        o.id === id ? { ...o, material: materialId } : o
      ),
    });
  },
}));
