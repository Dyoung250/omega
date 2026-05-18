import { PARAMETRIC_LIBRARY, evaluateWeight } from "../stores/libraryStore";
import { MATERIALS } from "../stores/sceneStore";
import type { SceneObject } from "@forgia/shared";

export interface QuoteLineItem {
  id: string;
  name: string;
  defId: string;
  materialId: string;
  materialName: string;
  params: Record<string, number | string | boolean>;
  weightKg: number;
  materialCost: number;
  paintCost: number;
  assemblyCost: number;
  unitPrice: number;
  qty: number;
  total: number;
}

export interface QuoteResult {
  items: QuoteLineItem[];
  subtotalMaterial: number;
  subtotalPaint: number;
  subtotalAssembly: number;
  transportCost: number;
  subtotal: number;
  marginPercent: number;
  marginAmount: number;
  total: number;
  totalWeightKg: number;
}

const DEFAULT_RATES = {
  paintPercent: 0.18,      // 18% del costo materiale
  assemblyPerItem: 35,     // €/elemento base
  assemblyPerKg: 0.8,      // €/kg extra
  transportBase: 45,       // fisso
  transportPerKg: 0.15,  // €/kg
  marginPercent: 0.35,     // 35% markup
};

export function calculateQuote(
  objects: SceneObject[],
  rates: Partial<typeof DEFAULT_RATES> = {}
): QuoteResult {
  const r = { ...DEFAULT_RATES, ...rates };

  const items: QuoteLineItem[] = [];
  let totalWeightKg = 0;

  for (const obj of objects) {
    const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
    if (!def || !def.weightFormula) continue;

    const weightKg = evaluateWeight(def.weightFormula, obj.params);
    const material = MATERIALS.find((m) => m.id === obj.material) ?? MATERIALS[0];
    const pricePerKg = def.pricePerKg ?? 2.5;

    const materialCost = weightKg * pricePerKg;
    const paintCost = materialCost * r.paintPercent;
    const assemblyCost = r.assemblyPerItem + weightKg * r.assemblyPerKg;
    const unitPrice = materialCost + paintCost + assemblyCost;

    totalWeightKg += weightKg;

    items.push({
      id: obj.id,
      name: obj.name,
      defId: obj.defId,
      materialId: obj.material,
      materialName: material?.nameIt ?? material?.name ?? "Ferro",
      params: obj.params,
      weightKg: Math.round(weightKg * 100) / 100,
      materialCost: Math.round(materialCost * 100) / 100,
      paintCost: Math.round(paintCost * 100) / 100,
      assemblyCost: Math.round(assemblyCost * 100) / 100,
      unitPrice: Math.round(unitPrice * 100) / 100,
      qty: 1,
      total: Math.round(unitPrice * 100) / 100,
    });
  }

  const subtotalMaterial = items.reduce((s, i) => s + i.materialCost, 0);
  const subtotalPaint = items.reduce((s, i) => s + i.paintCost, 0);
  const subtotalAssembly = items.reduce((s, i) => s + i.assemblyCost, 0);
  const transportCost = r.transportBase + totalWeightKg * r.transportPerKg;
  const subtotal = subtotalMaterial + subtotalPaint + subtotalAssembly + transportCost;
  const marginAmount = subtotal * r.marginPercent;
  const total = subtotal + marginAmount;

  return {
    items,
    subtotalMaterial: Math.round(subtotalMaterial * 100) / 100,
    subtotalPaint: Math.round(subtotalPaint * 100) / 100,
    subtotalAssembly: Math.round(subtotalAssembly * 100) / 100,
    transportCost: Math.round(transportCost * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    marginPercent: r.marginPercent,
    marginAmount: Math.round(marginAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    totalWeightKg: Math.round(totalWeightKg * 100) / 100,
  };
}

export function calculateSceneWeight(objects: SceneObject[]): number {
  let total = 0;
  for (const obj of objects) {
    const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
    if (!def || !def.weightFormula) continue;
    total += evaluateWeight(def.weightFormula, obj.params);
  }
  return Math.round(total * 100) / 100;
}
