import { ParametricDef, CategoryKey } from "@forgia/shared";

export const CATEGORIES: Record<CategoryKey, { id: CategoryKey; name: string }> = {
  "cancelli-recinzioni": { id: "cancelli-recinzioni", name: "Cancelli & Recinzioni" },
  "arredo-urbano": { id: "arredo-urbano", name: "Arredo Urbano" },
  "simboli-monogrammi": { id: "simboli-monogrammi", name: "Simboli & Monogrammi" },
  "giardino": { id: "giardino", name: "Giardino" },
  "elementi-decorativi": { id: "elementi-decorativi", name: "Elementi Decorativi" },
  "scale-e-ringhiere": { id: "scale-e-ringhiere", name: "Scale & Ringhiere" },
  "strutture-metalliche": { id: "strutture-metalliche", name: "Strutture Metalliche" },
  "illuminazione": { id: "illuminazione", name: "Illuminazione" },
  "arredo-interni": { id: "arredo-interni", name: "Arredo Interni" },
  "chiusure-e-coperture": { id: "chiusure-e-coperture", name: "Chiusure & Coperture" },
};

export const PARAMETRIC_LIBRARY: ParametricDef[] = [
  // ─── Cancelli & Recinzioni (11) ────────────────────────────────────────────
  {
    id: "cancello-singolo", name: "Single Gate", nameIt: "Cancello Singolo", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 120, altezza: 200, spessore: 4, spaziatura: 12 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 80, max: 300, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 350, step: 5, default: 200 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 2, max: 12, step: 1, default: 4 },
      { key: "spaziatura", label: "Spaziatura", unit: "cm", min: 5, max: 30, step: 1, default: 12 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.15", pricePerKg: 2.8,
  },
  {
    id: "cancello-doppio", name: "Double Gate", nameIt: "Cancello Doppio", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 240, altezza: 200, spessore: 4, spaziatura: 12 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 160, max: 600, step: 5, default: 240 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 350, step: 5, default: 200 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 2, max: 12, step: 1, default: 4 },
      { key: "spaziatura", label: "Spaziatura", unit: "cm", min: 5, max: 30, step: 1, default: 12 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.25", pricePerKg: 2.8,
  },
  {
    id: "griglia", name: "Grille", nameIt: "Griglia", category: "cancelli-recinzioni", icon: "grid",
    defaultParams: { larghezza: 100, altezza: 80, spessore: 3, maglia: 10 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 40, max: 200, step: 5, default: 100 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 40, max: 200, step: 5, default: 80 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 2, max: 10, step: 0.5, default: 3 },
      { key: "maglia", label: "Maglia", unit: "cm", min: 5, max: 30, step: 1, default: 10 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (100/maglia)) / 1000) * 1.1", pricePerKg: 3.2,
  },
  {
    id: "pannello-recinzione", name: "Fence Panel", nameIt: "Pannello Recinzione", category: "cancelli-recinzioni", icon: "panel",
    defaultParams: { larghezza: 200, altezza: 120, spessore: 3, profondita: 25 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 400, step: 5, default: 200 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 250, step: 5, default: 120 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 10, max: 50, step: 1, default: 25 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 2.8,
  },
  {
    id: "cancello-pedonale", name: "Pedestrian Gate", nameIt: "Cancello Pedonale", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 90, altezza: 180, spessore: 3, spaziatura: 10 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 250, step: 5, default: 180 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "spaziatura", label: "Spaziatura", unit: "cm", min: 5, max: 25, step: 1, default: 10 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.1", pricePerKg: 3.0,
  },
  {
    id: "cancello-scorrevole", name: "Sliding Gate", nameIt: "Cancello Scorrevole", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 300, altezza: 200, spessore: 4, guide: 10 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 5, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 350, step: 5, default: 200 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 2, max: 12, step: 1, default: 4 },
      { key: "guide", label: "Lunghezza guide", unit: "cm", min: 5, max: 50, step: 1, default: 10 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 2.9,
  },
  {
    id: "cancello-a-libro", name: "Bi-fold Gate", nameIt: "Cancello a Libro", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 180, altezza: 200, spessore: 4, pannelli: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 400, step: 5, default: 180 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 350, step: 5, default: 200 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 2, max: 12, step: 1, default: 4 },
      { key: "pannelli", label: "N. pannelli", unit: "n", min: 2, max: 8, step: 1, default: 4 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * pannelli) / 1000) * 1.15", pricePerKg: 2.8,
  },
  {
    id: "sbarra-automatica", name: "Barrier Arm", nameIt: "Sbarra Automatica", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 300, altezza: 120, spessore: 3, bracci: 1 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 5, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 80, max: 200, step: 5, default: 120 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 3 },
      { key: "bracci", label: "N. bracci", unit: "n", min: 1, max: 3, step: 1, default: 1 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785 * bracci) / 1000) * 1.1", pricePerKg: 3.2,
  },
  {
    id: "cancello-carraio", name: "Driveway Gate", nameIt: "Cancello Carraio", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 350, altezza: 220, spessore: 5, spaziatura: 15 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 200, max: 600, step: 5, default: 350 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 350, step: 5, default: 220 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 3, max: 15, step: 1, default: 5 },
      { key: "spaziatura", label: "Spaziatura", unit: "cm", min: 5, max: 40, step: 1, default: 15 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.2", pricePerKg: 2.8,
  },
  {
    id: "cancello-industriale", name: "Industrial Gate", nameIt: "Cancello Industriale", category: "cancelli-recinzioni", icon: "gate",
    defaultParams: { larghezza: 400, altezza: 250, spessore: 6, rinforzi: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 250, max: 800, step: 10, default: 400 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 400, step: 5, default: 250 },
      { key: "spessore", label: "Spessore sbarre", unit: "mm", min: 4, max: 20, step: 1, default: 6 },
      { key: "rinforzi", label: "N. rinforzi", unit: "n", min: 2, max: 10, step: 1, default: 4 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * rinforzi) / 1000) * 1.25", pricePerKg: 3.0,
  },
  {
    id: "recinzione-alta", name: "High Fence", nameIt: "Recinzione Alta", category: "cancelli-recinzioni", icon: "panel",
    defaultParams: { larghezza: 250, altezza: 200, spessore: 4, filo: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 500, step: 5, default: 250 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 300, step: 5, default: 200 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "filo", label: "N. fili", unit: "n", min: 1, max: 8, step: 1, default: 3 },
    ],
    defaultMaterial: "zincato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * filo) / 1000) * 1.1", pricePerKg: 2.6,
  },
  // ─── Arredo Urbano (7) ───────────────────────────────────────────────────
  {
    id: "ringhiera", name: "Railing", nameIt: "Ringhiera", category: "arredo-urbano", icon: "railing",
    defaultParams: { larghezza: 150, altezza: 90, spessore: 2.5, barre: 5 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "barre", label: "N. barre", unit: "n", min: 2, max: 15, step: 1, default: 5 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (barre/5)) / 1000) * 1.2", pricePerKg: 3.0,
  },
  {
    id: "arco", name: "Arch", nameIt: "Arco", category: "arredo-urbano", icon: "arch",
    defaultParams: { larghezza: 200, altezza: 250, spessore: 5, raggio: 100 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 400, step: 5, default: 200 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 400, step: 5, default: 250 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "raggio", label: "Raggio arco", unit: "cm", min: 50, max: 200, step: 5, default: 100 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "(((larghezza + altezza * 2) * spessore * 0.00785) / 1000) * 1.4", pricePerKg: 3.5,
  },
  {
    id: "parapetto", name: "Parapet", nameIt: "Parapetto", category: "arredo-urbano", icon: "parapet",
    defaultParams: { larghezza: 100, altezza: 110, spessore: 2, pannelli: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 300, step: 5, default: 100 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 80, max: 150, step: 5, default: 110 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 5, step: 0.5, default: 2 },
      { key: "pannelli", label: "N. pannelli", unit: "n", min: 1, max: 8, step: 1, default: 3 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * pannelli) / 1000) * 1.1", pricePerKg: 3.0,
  },
  {
    id: "ringhiera-vetro", name: "Glass Railing", nameIt: "Ringhiera Vetro", category: "arredo-urbano", icon: "railing",
    defaultParams: { larghezza: 150, altezza: 90, spessore: 3, pannelli: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "pannelli", label: "N. pannelli", unit: "n", min: 1, max: 8, step: 1, default: 3 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * pannelli) / 1000) * 1.15", pricePerKg: 3.2,
  },
  {
    id: "ringhiera-cavo", name: "Cable Railing", nameIt: "Ringhiera Cavo", category: "arredo-urbano", icon: "railing",
    defaultParams: { larghezza: 150, altezza: 90, spessore: 2.5, cavi: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "cavi", label: "N. cavi", unit: "n", min: 1, max: 8, step: 1, default: 4 },
    ],
    defaultMaterial: "acciaio-inox", weightFormula: "((larghezza * altezza * spessore * 0.00785 * cavi) / 1000) * 1.05", pricePerKg: 4.5,
  },
  {
    id: "corrimano", name: "Handrail", nameIt: "Corrimano", category: "arredo-urbano", icon: "railing",
    defaultParams: { larghezza: 200, altezza: 90, spessore: 3, supporti: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 500, step: 5, default: 200 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 120, step: 5, default: 90 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "supporti", label: "N. supporti", unit: "n", min: 2, max: 10, step: 1, default: 3 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * supporti) / 1000) * 1.1", pricePerKg: 3.0,
  },
  {
    id: "balaustra", name: "Balustrade", nameIt: "Balaustra", category: "arredo-urbano", icon: "railing",
    defaultParams: { larghezza: 120, altezza: 100, spessore: 3, colonne: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 70, max: 150, step: 5, default: 100 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "colonne", label: "N. colonne", unit: "n", min: 2, max: 10, step: 1, default: 4 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * colonne) / 1000) * 1.2", pricePerKg: 3.5,
  },
  // ─── Simboli & Monogrammi (6) ──────────────────────────────────────────────
  {
    id: "supporto-insegna", name: "Sign Bracket", nameIt: "Supporto Insegna", category: "simboli-monogrammi", icon: "bracket",
    defaultParams: { lunghezza: 60, altezza: 40, spessore: 3, profondita: 30 },
    paramDefs: [
      { key: "lunghezza", label: "Lunghezza", unit: "cm", min: 30, max: 150, step: 5, default: 60 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 20, max: 100, step: 5, default: 40 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 15, max: 80, step: 1, default: 30 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((lunghezza * altezza * spessore * 0.00785) / 1000) * 1.5", pricePerKg: 3.5,
  },
  {
    id: "lettera-ferro", name: "Iron Letter", nameIt: "Lettera Ferro", category: "simboli-monogrammi", icon: "letter",
    defaultParams: { larghezza: 50, altezza: 70, spessore: 4, profondita: 8 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 20, max: 150, step: 5, default: 50 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 20, max: 200, step: 5, default: 70 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 3, max: 20, step: 1, default: 8 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 3.5,
  },
  {
    id: "numero-ferro", name: "Iron Number", nameIt: "Numero Ferro", category: "simboli-monogrammi", icon: "number",
    defaultParams: { larghezza: 40, altezza: 60, spessore: 4, profondita: 8 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 15, max: 120, step: 5, default: 40 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 15, max: 150, step: 5, default: 60 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 3, max: 20, step: 1, default: 8 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 3.2,
  },
  {
    id: "logo-personalizzato", name: "Custom Logo", nameIt: "Logo Personalizzato", category: "simboli-monogrammi", icon: "logo",
    defaultParams: { larghezza: 80, altezza: 80, spessore: 3, dettaglio: 5 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 200, step: 5, default: 80 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 200, step: 5, default: 80 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 3 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 5 },
    ],
    defaultMaterial: "rame-anticato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.2", pricePerKg: 5.0,
  },
  {
    id: "insegna-negozio", name: "Shop Sign", nameIt: "Insegna Negozio", category: "simboli-monogrammi", icon: "sign",
    defaultParams: { larghezza: 120, altezza: 40, spessore: 3, profondita: 15 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 300, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 20, max: 100, step: 5, default: 40 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 5, max: 40, step: 1, default: 15 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.4", pricePerKg: 3.0,
  },
  {
    id: "stemma-araldico", name: "Coat of Arms", nameIt: "Stemma Araldico", category: "simboli-monogrammi", icon: "crest",
    defaultParams: { larghezza: 60, altezza: 70, spessore: 4, dettaglio: 6 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 150, step: 5, default: 60 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 180, step: 5, default: 70 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 6 },
    ],
    defaultMaterial: "bronzo", weightFormula: "((larghezza * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.3", pricePerKg: 6.0,
  },
  // ─── Giardino (6) ──────────────────────────────────────────────────────────
  {
    id: "fioriera", name: "Planter", nameIt: "Fioriera", category: "giardino", icon: "planter",
    defaultParams: { larghezza: 80, altezza: 50, spessore: 2.5, profondita: 40 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 40, max: 200, step: 5, default: 80 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 100, step: 5, default: 50 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 20, max: 100, step: 5, default: 40 },
    ],
    defaultMaterial: "zincato", weightFormula: "(((larghezza + profondita) * 2 * altezza * spessore * 0.00785) / 1000) * 1.15", pricePerKg: 2.5,
  },
  {
    id: "pergola", name: "Pergola", nameIt: "Pergola", category: "giardino", icon: "pergola",
    defaultParams: { larghezza: 300, altezza: 220, spessore: 4, colonne: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 10, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 350, step: 5, default: 220 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "colonne", label: "N. colonne", unit: "n", min: 2, max: 8, step: 1, default: 4 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * colonne) / 1000) * 1.2", pricePerKg: 2.8,
  },
  {
    id: "gazebo", name: "Gazebo", nameIt: "Gazebo", category: "giardino", icon: "gazebo",
    defaultParams: { larghezza: 300, altezza: 280, spessore: 5, profondita: 300 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 10, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 180, max: 400, step: 5, default: 280 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 100, max: 600, step: 10, default: 300 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "(((larghezza + profondita) * 2 * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 3.0,
  },
  {
    id: "grigliato-giardino", name: "Garden Trellis", nameIt: "Grigliato Giardino", category: "giardino", icon: "grid",
    defaultParams: { larghezza: 200, altezza: 200, spessore: 2.5, maglia: 15 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 200 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 300, step: 5, default: 200 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "maglia", label: "Maglia", unit: "cm", min: 5, max: 40, step: 1, default: 15 },
    ],
    defaultMaterial: "zincato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (100/maglia)) / 1000) * 1.1", pricePerKg: 2.5,
  },
  {
    id: "supporto-vasi", name: "Plant Stand", nameIt: "Supporto Vasi", category: "giardino", icon: "stand",
    defaultParams: { larghezza: 60, altezza: 80, spessore: 2.5, ripiani: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 150, step: 5, default: 60 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 40, max: 200, step: 5, default: 80 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "ripiani", label: "N. ripiani", unit: "n", min: 1, max: 6, step: 1, default: 3 },
    ],
    defaultMaterial: "zincato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * ripiani) / 1000) * 1.15", pricePerKg: 2.5,
  },
  {
    id: "divisorio-giardino", name: "Garden Divider", nameIt: "Divisorio Giardino", category: "giardino", icon: "panel",
    defaultParams: { larghezza: 150, altezza: 180, spessore: 3, pannelli: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 300, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 80, max: 250, step: 5, default: 180 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "pannelli", label: "N. pannelli", unit: "n", min: 1, max: 8, step: 1, default: 3 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * pannelli) / 1000) * 1.1", pricePerKg: 2.8,
  },
  // ─── Elementi Decorativi (5) ───────────────────────────────────────────────
  {
    id: "rosone", name: "Rose Window", nameIt: "Rosone", category: "elementi-decorativi", icon: "rose",
    defaultParams: { diametro: 80, spessore: 3, dettaglio: 6, profondita: 5 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 30, max: 200, step: 5, default: 80 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 3 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 6 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 2, max: 15, step: 1, default: 5 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((Math.PI * (diametro/2) * (diametro/2) * spessore * 0.00785 * dettaglio) / 1000) * 1.2", pricePerKg: 3.5,
  },
  {
    id: "pannello-decorativo", name: "Decorative Panel", nameIt: "Pannello Decorativo", category: "elementi-decorativi", icon: "panel",
    defaultParams: { larghezza: 100, altezza: 100, spessore: 3, dettaglio: 5 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 300, step: 5, default: 100 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 300, step: 5, default: 100 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 3 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 5 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.15", pricePerKg: 3.5,
  },
  {
    id: "spirale-decorativa", name: "Decorative Spiral", nameIt: "Spirale Decorativa", category: "elementi-decorativi", icon: "spiral",
    defaultParams: { altezza: 150, diametro: 40, spessore: 4, dettaglio: 5 },
    paramDefs: [
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 300, step: 5, default: 150 },
      { key: "diametro", label: "Diametro", unit: "cm", min: 15, max: 100, step: 5, default: 40 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 5 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.1", pricePerKg: 3.8,
  },
  {
    id: "fiore-ferro", name: "Iron Flower", nameIt: "Fiore Ferro", category: "elementi-decorativi", icon: "flower",
    defaultParams: { diametro: 30, spessore: 3, dettaglio: 4, profondita: 5 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 10, max: 80, step: 5, default: 30 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 8, step: 0.5, default: 3 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 2, max: 15, step: 1, default: 5 },
    ],
    defaultMaterial: "rame-anticato", weightFormula: "((Math.PI * (diametro/2) * (diametro/2) * spessore * 0.00785 * dettaglio) / 1000) * 1.3", pricePerKg: 5.0,
  },
  {
    id: "albero-ferro", name: "Iron Tree", nameIt: "Albero Ferro", category: "elementi-decorativi", icon: "tree",
    defaultParams: { altezza: 200, diametro: 60, spessore: 4, dettaglio: 6 },
    paramDefs: [
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 400, step: 5, default: 200 },
      { key: "diametro", label: "Diametro chioma", unit: "cm", min: 20, max: 150, step: 5, default: 60 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 10, step: 1, default: 6 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.2", pricePerKg: 3.5,
  },
  // ─── Scale & Ringhiere (5) ─────────────────────────────────────────────────
  {
    id: "scala-a-chiocciola", name: "Spiral Staircase", nameIt: "Scala a Chiocciola", category: "scale-e-ringhiere", icon: "stairs",
    defaultParams: { diametro: 150, altezza: 280, spessore: 5, rampe: 12 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 100, max: 300, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 500, step: 5, default: 280 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "rampe", label: "N. rampe", unit: "n", min: 6, max: 24, step: 1, default: 12 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * rampe) / 1000) * 1.3", pricePerKg: 3.5,
  },
  {
    id: "scala-dritta", name: "Straight Staircase", nameIt: "Scala Dritta", category: "scale-e-ringhiere", icon: "stairs",
    defaultParams: { larghezza: 100, altezza: 280, spessore: 4, rampe: 12 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 60, max: 200, step: 5, default: 100 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 500, step: 5, default: 280 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 10, step: 0.5, default: 4 },
      { key: "rampe", label: "N. rampe", unit: "n", min: 6, max: 24, step: 1, default: 12 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * rampe) / 1000) * 1.25", pricePerKg: 3.2,
  },
  {
    id: "scala-esterna", name: "External Staircase", nameIt: "Scala Esterna", category: "scale-e-ringhiere", icon: "stairs",
    defaultParams: { larghezza: 120, altezza: 300, spessore: 5, profondita: 100 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 80, max: 200, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 500, step: 5, default: 300 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 50, max: 200, step: 5, default: 100 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/50)) / 1000) * 1.2", pricePerKg: 3.0,
  },
  {
    id: "scala-elicoidale", name: "Helical Staircase", nameIt: "Scala Elicoidale", category: "scale-e-ringhiere", icon: "stairs",
    defaultParams: { diametro: 180, altezza: 300, spessore: 5, rampe: 14 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 120, max: 350, step: 5, default: 180 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 500, step: 5, default: 300 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "rampe", label: "N. rampe", unit: "n", min: 8, max: 24, step: 1, default: 14 },
    ],
    defaultMaterial: "acciaio-inox", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * rampe) / 1000) * 1.35", pricePerKg: 4.5,
  },
  {
    id: "ringhiera-scale", name: "Stair Railing", nameIt: "Ringhiera Scale", category: "scale-e-ringhiere", icon: "railing",
    defaultParams: { larghezza: 150, altezza: 90, spessore: 3, pannelli: 3 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 400, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "spessore", label: "Spessore ferro", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "pannelli", label: "N. pannelli", unit: "n", min: 1, max: 8, step: 1, default: 3 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * pannelli) / 1000) * 1.15", pricePerKg: 3.2,
  },
  // ─── Strutture Metalliche (5) ──────────────────────────────────────────────
  {
    id: "tettoia", name: "Canopy", nameIt: "Tettoia", category: "strutture-metalliche", icon: "canopy",
    defaultParams: { larghezza: 300, altezza: 250, spessore: 4, profondita: 200 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 10, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 400, step: 5, default: 250 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 100, max: 500, step: 10, default: 200 },
    ],
    defaultMaterial: "zincato", weightFormula: "(((larghezza + profondita) * 2 * altezza * spessore * 0.00785) / 1000) * 1.2", pricePerKg: 2.6,
  },
  {
    id: "pensilina", name: "Shelter", nameIt: "Pensilina", category: "strutture-metalliche", icon: "shelter",
    defaultParams: { larghezza: 400, altezza: 250, spessore: 5, profondita: 150 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 200, max: 800, step: 10, default: 400 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 400, step: 5, default: 250 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 12, step: 1, default: 5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 80, max: 400, step: 10, default: 150 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "(((larghezza + profondita) * 2 * altezza * spessore * 0.00785) / 1000) * 1.25", pricePerKg: 3.0,
  },
  {
    id: "capriata", name: "Truss", nameIt: "Capriata", category: "strutture-metalliche", icon: "truss",
    defaultParams: { larghezza: 500, altezza: 100, spessore: 5, profondita: 50 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 200, max: 1000, step: 10, default: 500 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 200, step: 5, default: 100 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 15, step: 1, default: 5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 20, max: 100, step: 5, default: 50 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/25)) / 1000) * 1.3", pricePerKg: 3.0,
  },
  {
    id: "trave", name: "Beam", nameIt: "Trave", category: "strutture-metalliche", icon: "beam",
    defaultParams: { larghezza: 400, altezza: 30, spessore: 8, profondita: 20 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 1000, step: 10, default: 400 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 10, max: 60, step: 2, default: 30 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 4, max: 20, step: 1, default: 8 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 10, max: 50, step: 2, default: 20 },
    ],
    defaultMaterial: "acciaio-ossidato", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/10)) / 1000) * 1.1", pricePerKg: 2.8,
  },
  {
    id: "colonna", name: "Column", nameIt: "Colonna", category: "strutture-metalliche", icon: "column",
    defaultParams: { diametro: 20, altezza: 300, spessore: 5, base: 40 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 10, max: 60, step: 2, default: 20 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 500, step: 5, default: 300 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 3, max: 15, step: 1, default: 5 },
      { key: "base", label: "Lato base", unit: "cm", min: 20, max: 100, step: 5, default: 40 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * (base/20)) / 1000) * 1.2", pricePerKg: 3.0,
  },
  // ─── Illuminazione (5) ─────────────────────────────────────────────────────
  {
    id: "lanterna", name: "Lantern", nameIt: "Lanterna", category: "illuminazione", icon: "lamp",
    defaultParams: { diametro: 30, altezza: 50, spessore: 2.5, bracci: 4 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 15, max: 60, step: 2, default: 30 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 100, step: 5, default: 50 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "bracci", label: "N. bracci", unit: "n", min: 1, max: 8, step: 1, default: 4 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * bracci) / 1000) * 1.1", pricePerKg: 3.5,
  },
  {
    id: "lampione", name: "Street Lamp", nameIt: "Lampione", category: "illuminazione", icon: "lamp",
    defaultParams: { diametro: 15, altezza: 300, spessore: 4, bracci: 1 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 8, max: 30, step: 2, default: 15 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 200, max: 500, step: 10, default: 300 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "bracci", label: "N. bracci", unit: "n", min: 1, max: 4, step: 1, default: 1 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * bracci) / 1000) * 1.15", pricePerKg: 3.2,
  },
  {
    id: "applique", name: "Wall Light", nameIt: "Applique", category: "illuminazione", icon: "lamp",
    defaultParams: { larghezza: 25, altezza: 30, spessore: 3, profondita: 20 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 10, max: 60, step: 5, default: 25 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 10, max: 60, step: 5, default: 30 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 5, max: 40, step: 2, default: 20 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.2", pricePerKg: 3.5,
  },
  {
    id: "candelabro", name: "Candelabra", nameIt: "Candelabro", category: "illuminazione", icon: "lamp",
    defaultParams: { diametro: 40, altezza: 150, spessore: 4, bracci: 5 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 20, max: 80, step: 5, default: 40 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 80, max: 300, step: 5, default: 150 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "bracci", label: "N. bracci", unit: "n", min: 1, max: 10, step: 1, default: 5 },
    ],
    defaultMaterial: "bronzo", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * bracci) / 1000) * 1.25", pricePerKg: 5.5,
  },
  {
    id: "torcia-giardino", name: "Garden Torch", nameIt: "Torcia Giardino", category: "illuminazione", icon: "torch",
    defaultParams: { diametro: 10, altezza: 120, spessore: 3, base: 25 },
    paramDefs: [
      { key: "diametro", label: "Diametro", unit: "cm", min: 5, max: 20, step: 1, default: 10 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 200, step: 5, default: 120 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "base", label: "Lato base", unit: "cm", min: 15, max: 50, step: 5, default: 25 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((Math.PI * diametro * altezza * spessore * 0.00785 * (base/10)) / 1000) * 1.15", pricePerKg: 3.0,
  },
  // ─── Arredo Interni (5) ────────────────────────────────────────────────────
  {
    id: "consolle", name: "Console", nameIt: "Consolle", category: "arredo-interni", icon: "table",
    defaultParams: { larghezza: 120, altezza: 85, spessore: 3, profondita: 35 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 60, max: 250, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 120, step: 5, default: 85 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 20, max: 60, step: 5, default: 35 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/20)) / 1000) * 1.2", pricePerKg: 3.5,
  },
  {
    id: "tavolo-ferro", name: "Iron Table", nameIt: "Tavolo Ferro", category: "arredo-interni", icon: "table",
    defaultParams: { larghezza: 150, altezza: 75, spessore: 4, profondita: 80 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 80, max: 300, step: 5, default: 150 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 60, max: 110, step: 5, default: 75 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 40, max: 150, step: 5, default: 80 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/40)) / 1000) * 1.15", pricePerKg: 3.0,
  },
  {
    id: "seduta-ferro", name: "Iron Seat", nameIt: "Seduta Ferro", category: "arredo-interni", icon: "seat",
    defaultParams: { larghezza: 50, altezza: 45, spessore: 3, profondita: 50 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 120, step: 5, default: 50 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 80, step: 5, default: 45 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 25, max: 80, step: 5, default: 50 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/25)) / 1000) * 1.1", pricePerKg: 3.2,
  },
  {
    id: "portariviste", name: "Magazine Rack", nameIt: "Portariviste", category: "arredo-interni", icon: "rack",
    defaultParams: { larghezza: 40, altezza: 60, spessore: 2.5, profondita: 25 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 20, max: 80, step: 5, default: 40 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 30, max: 100, step: 5, default: 60 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 1.5, max: 6, step: 0.5, default: 2.5 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 10, max: 40, step: 5, default: 25 },
    ],
    defaultMaterial: "ferro-lucido", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/15)) / 1000) * 1.2", pricePerKg: 3.5,
  },
  {
    id: "mensola", name: "Shelf", nameIt: "Mensola", category: "arredo-interni", icon: "shelf",
    defaultParams: { larghezza: 80, altezza: 25, spessore: 3, profondita: 25 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 30, max: 200, step: 5, default: 80 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 10, max: 50, step: 5, default: 25 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 10, max: 40, step: 5, default: 25 },
    ],
    defaultMaterial: "acciaio-inox", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (profondita/15)) / 1000) * 1.1", pricePerKg: 4.0,
  },
  // ─── Chiusure & Coperture (5) ──────────────────────────────────────────────
  {
    id: "tettoia-chiusa", name: "Closed Canopy", nameIt: "Tettoia Chiusa", category: "chiusure-e-coperture", icon: "canopy",
    defaultParams: { larghezza: 300, altezza: 250, spessore: 4, profondita: 200 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 150, max: 600, step: 10, default: 300 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 150, max: 400, step: 5, default: 250 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "profondita", label: "Profondità", unit: "cm", min: 100, max: 500, step: 10, default: 200 },
    ],
    defaultMaterial: "zincato", weightFormula: "(((larghezza + profondita) * 2 * altezza * spessore * 0.00785) / 1000) * 1.3", pricePerKg: 2.6,
  },
  {
    id: "chiusura-scorrevole", name: "Sliding Closure", nameIt: "Chiusura Scorrevole", category: "chiusure-e-coperture", icon: "gate",
    defaultParams: { larghezza: 250, altezza: 200, spessore: 4, guide: 15 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 100, max: 500, step: 5, default: 250 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 300, step: 5, default: 200 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "guide", label: "Lunghezza guide", unit: "cm", min: 5, max: 50, step: 1, default: 15 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785) / 1000) * 1.25", pricePerKg: 2.8,
  },
  {
    id: "porta-ferro", name: "Iron Door", nameIt: "Porta Ferro", category: "chiusure-e-coperture", icon: "door",
    defaultParams: { larghezza: 90, altezza: 200, spessore: 4, dettaglio: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 60, max: 150, step: 5, default: 90 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 100, max: 250, step: 5, default: 200 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 12, step: 1, default: 4 },
      { key: "dettaglio", label: "Livello dettaglio", unit: "n", min: 1, max: 8, step: 1, default: 4 },
    ],
    defaultMaterial: "ferro-battuto", weightFormula: "((larghezza * altezza * spessore * 0.00785 * dettaglio) / 1000) * 1.2", pricePerKg: 3.0,
  },
  {
    id: "finestra-ferro", name: "Iron Window", nameIt: "Finestra Ferro", category: "chiusure-e-coperture", icon: "window",
    defaultParams: { larghezza: 100, altezza: 120, spessore: 3, griglia: 4 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 200, step: 5, default: 100 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 200, step: 5, default: 120 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 8, step: 0.5, default: 3 },
      { key: "griglia", label: "N. griglie", unit: "n", min: 1, max: 10, step: 1, default: 4 },
    ],
    defaultMaterial: "vernice-nera", weightFormula: "((larghezza * altezza * spessore * 0.00785 * griglia) / 1000) * 1.1", pricePerKg: 3.0,
  },
  {
    id: "grata-sicurezza", name: "Security Grille", nameIt: "Grata Sicurezza", category: "chiusure-e-coperture", icon: "grid",
    defaultParams: { larghezza: 120, altezza: 150, spessore: 4, maglia: 8 },
    paramDefs: [
      { key: "larghezza", label: "Larghezza", unit: "cm", min: 50, max: 300, step: 5, default: 120 },
      { key: "altezza", label: "Altezza", unit: "cm", min: 50, max: 250, step: 5, default: 150 },
      { key: "spessore", label: "Spessore", unit: "mm", min: 2, max: 10, step: 0.5, default: 4 },
      { key: "maglia", label: "Maglia", unit: "cm", min: 3, max: 20, step: 1, default: 8 },
    ],
    defaultMaterial: "acciaio-inox", weightFormula: "((larghezza * altezza * spessore * 0.00785 * (100/maglia)) / 1000) * 1.15", pricePerKg: 4.0,
  },
];

export function getLibraryByCategory(): Record<CategoryKey, ParametricDef[]> {
  const result: Partial<Record<CategoryKey, ParametricDef[]>> = {};
  for (const def of PARAMETRIC_LIBRARY) {
    const cat = def.category as CategoryKey;
    if (!result[cat]) result[cat] = [];
    result[cat]!.push(def);
  }
  return result as Record<CategoryKey, ParametricDef[]>;
}

export function evaluateWeight(formula: string, params: Record<string, number | string | boolean>): number {
  try {
    const fn = new Function(
      "larghezza", "altezza", "spessore", "spaziatura", "maglia", "barre", "raggio", "pannelli",
      "lunghezza", "profondita", "diametro", "dettaglio", "rampe", "bracci", "cavi",
      "supporti", "colonne", "filo", "rinforzi", "guide", "base", "griglia", "ripiani",
      `"use strict"; return (${formula});`
    );
    return fn(
      Number(params.larghezza ?? 0), Number(params.altezza ?? 0), Number(params.spessore ?? 0),
      Number(params.spaziatura ?? 0), Number(params.maglia ?? 0), Number(params.barre ?? 0),
      Number(params.raggio ?? 0), Number(params.pannelli ?? 0), Number(params.lunghezza ?? 0),
      Number(params.profondita ?? 0), Number(params.diametro ?? 0), Number(params.dettaglio ?? 0),
      Number(params.rampe ?? 0), Number(params.bracci ?? 0), Number(params.cavi ?? 0),
      Number(params.supporti ?? 0), Number(params.colonne ?? 0), Number(params.filo ?? 0),
      Number(params.rinforzi ?? 0), Number(params.guide ?? 0), Number(params.base ?? 0),
      Number(params.griglia ?? 0), Number(params.ripiani ?? 0)
    );
  } catch {
    return 0;
  }
}
