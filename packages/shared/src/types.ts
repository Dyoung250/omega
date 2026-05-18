export interface ParametricParams {
  [key: string]: number | string | boolean;
}

export interface ParametricDef {
  id: string;
  name: string;
  nameIt: string;
  category: string;
  icon: string;
  defaultParams: ParametricParams;
  paramDefs: ParamDef[];
  defaultMaterial: string;
  weightFormula: string;
  pricePerKg: number;
}

export interface ParamDef {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SceneObject {
  id: string;
  defId: string;
  name: string;
  params: ParametricParams;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
  material: string;
}

export type CategoryKey =
  | "cancelli-recinzioni"
  | "arredo-urbano"
  | "simboli-monogrammi"
  | "giardino"
  | "elementi-decorativi"
  | "scale-e-ringhiere"
  | "strutture-metalliche"
  | "illuminazione"
  | "arredo-interni"
  | "chiusure-e-coperture";
