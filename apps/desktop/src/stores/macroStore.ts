export interface MacroElement {
  defId: string;
  params?: Record<string, number | string | boolean>;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  material?: string;
}

export interface MacroDef {
  id: string;
  nameIt: string;
  description: string;
  icon: string;
  elements: MacroElement[];
}

/** Grid layout constants: every element sits on a distinct (X,Z) cell */
const G = 300; // grid cell size on X / Z

export const MACRO_LIBRARY: MacroDef[] = [
  {
    id: "macro-cancello-completo",
    nameIt: "Cancello Completo",
    description: "Cancello singolo con pilastri laterali",
    icon: "gate",
    elements: [
      { defId: "colonna", position: [-G, 0, 0], params: { altezza: 220 }, material: "ferro-battuto" },
      { defId: "cancello-singolo", position: [0, 0, 0], material: "ferro-battuto" },
      { defId: "colonna", position: [G, 0, 0], params: { altezza: 220 }, material: "ferro-battuto" },
    ],
  },
  {
    id: "macro-recinzione-modulo",
    nameIt: "Recinzione Modulo",
    description: "3 pannelli recinzione con 4 pilastri",
    icon: "fence",
    elements: [
      { defId: "colonna", position: [-1.5 * G, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "pannello-recinzione", position: [-0.5 * G, 0, 0], material: "zincato" },
      { defId: "colonna", position: [0.5 * G, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "pannello-recinzione", position: [1.5 * G, 0, 0], material: "zincato" },
      { defId: "colonna", position: [2.5 * G, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "pannello-recinzione", position: [3.5 * G, 0, 0], material: "zincato" },
      { defId: "colonna", position: [4.5 * G, 0, 0], params: { altezza: 200 }, material: "zincato" },
    ],
  },
  {
    id: "macro-scala-ringhiera",
    nameIt: "Scala con Ringhiera",
    description: "Scala dritta con ringhiere bilaterali",
    icon: "stairs",
    elements: [
      { defId: "scala-dritta", position: [0, 0, 0], material: "ferro-lucido" },
      { defId: "ringhiera", position: [-G, 0, 0], params: { lunghezza: 300 }, material: "ferro-lucido" },
      { defId: "ringhiera", position: [G, 0, 0], params: { lunghezza: 300 }, material: "ferro-lucido" },
      { defId: "corrimano", position: [-G, 110, 0], params: { lunghezza: 300 }, material: "ottone-patinato" },
      { defId: "corrimano", position: [G, 110, 0], params: { lunghezza: 300 }, material: "ottone-patinato" },
    ],
  },
  {
    id: "macro-pergola-giardino",
    nameIt: "Pergola Giardino",
    description: "Pergola 3×3 con grigliato e fioriere",
    icon: "pergola",
    elements: [
      { defId: "pergola", position: [0, 0, 0], material: "ruggine-patinata" },
      { defId: "grigliato-giardino", position: [0, 0, G], params: { larghezza: 300 }, material: "ruggine-patinata" },
      { defId: "fioriera", position: [-G, 0, G], material: "vernice-nera" },
      { defId: "fioriera", position: [G, 0, G], material: "vernice-nera" },
    ],
  },
  {
    id: "macro-tettoia-auto",
    nameIt: "Tettoia Auto",
    description: "Tettoia 5×3 con 2 colonne e trave",
    icon: "carport",
    elements: [
      { defId: "tettoia", position: [0, 0, 0], params: { larghezza: 500, profondita: 300 }, material: "zincato" },
      { defId: "colonna", position: [-G, 0, G], params: { altezza: 250, diametro: 15 }, material: "zincato" },
      { defId: "colonna", position: [G, 0, G], params: { altezza: 250, diametro: 15 }, material: "zincato" },
      { defId: "trave", position: [0, 240, G], params: { lunghezza: 500 }, material: "zincato" },
    ],
  },
  {
    id: "macro-lanterna-giardino",
    nameIt: "Lanterna Giardino",
    description: "Lampione con lanterna e base decorativa",
    icon: "lamp",
    elements: [
      { defId: "pannello-decorativo", position: [-G, 0, 0], params: { larghezza: 60, altezza: 10 }, material: "ferro-battuto" },
      { defId: "lampione", position: [0, 0, 0], params: { altezza: 280 }, material: "ferro-battuto" },
      { defId: "lanterna", position: [G, 0, 0], material: "ottone-patinato" },
    ],
  },
  {
    id: "macro-grata-finestra",
    nameIt: "Grata Finestra",
    description: "Finestra ferro con grata sicurezza sovrapposta",
    icon: "window",
    elements: [
      { defId: "finestra-ferro", position: [0, 0, 0], material: "vernice-nera" },
      { defId: "grata-sicurezza", position: [0, 0, G], params: { larghezza: 120, altezza: 150 }, material: "zincato" },
    ],
  },
  {
    id: "macro-ingresso-arco",
    nameIt: "Ingresso Arco",
    description: "Arco con supporto insegna e insegna negozio",
    icon: "arch",
    elements: [
      { defId: "supporto-insegna", position: [-G, 0, 0], material: "ferro-battuto" },
      { defId: "arco", position: [0, 0, 0], params: { larghezza: 300, altezza: 280 }, material: "ferro-battuto" },
      { defId: "insegna-negozio", position: [G, 0, 0], params: { larghezza: 200, altezza: 60 }, material: "cromo-lucido" },
    ],
  },
];
