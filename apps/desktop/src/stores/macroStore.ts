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

export const MACRO_LIBRARY: MacroDef[] = [
  {
    id: "macro-cancello-completo",
    nameIt: "Cancello Completo",
    description: "Cancello singolo con pilastri laterali",
    icon: "gate",
    elements: [
      { defId: "cancello-singolo", position: [0, 0, 0], material: "ferro-battuto" },
      { defId: "colonna", position: [-160, 0, 0], params: { altezza: 220 }, material: "ferro-battuto" },
      { defId: "colonna", position: [160, 0, 0], params: { altezza: 220 }, material: "ferro-battuto" },
    ],
  },
  {
    id: "macro-recinzione-modulo",
    nameIt: "Recinzione Modulo",
    description: "3 pannelli recinzione con 4 pilastri",
    icon: "fence",
    elements: [
      { defId: "pannello-recinzione", position: [0, 0, 0], material: "zincato" },
      { defId: "pannello-recinzione", position: [260, 0, 0], material: "zincato" },
      { defId: "pannello-recinzione", position: [520, 0, 0], material: "zincato" },
      { defId: "colonna", position: [-130, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "colonna", position: [130, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "colonna", position: [390, 0, 0], params: { altezza: 200 }, material: "zincato" },
      { defId: "colonna", position: [650, 0, 0], params: { altezza: 200 }, material: "zincato" },
    ],
  },
  {
    id: "macro-scala-ringhiera",
    nameIt: "Scala con Ringhiera",
    description: "Scala dritta con ringhiere bilaterali",
    icon: "stairs",
    elements: [
      { defId: "scala-dritta", position: [0, 0, 0], material: "ferro-lucido" },
      { defId: "ringhiera", position: [-60, 0, 0], params: { lunghezza: 300 }, material: "ferro-lucido" },
      { defId: "ringhiera", position: [60, 0, 0], params: { lunghezza: 300 }, material: "ferro-lucido" },
      { defId: "corrimano", position: [-60, 110, 0], params: { lunghezza: 300 }, material: "ottone-patinato" },
      { defId: "corrimano", position: [60, 110, 0], params: { lunghezza: 300 }, material: "ottone-patinato" },
    ],
  },
  {
    id: "macro-pergola-giardino",
    nameIt: "Pergola Giardino",
    description: "Pergola 3×3 con grigliato e fioriere",
    icon: "pergola",
    elements: [
      { defId: "pergola", position: [0, 0, 0], material: "ruggine-patinata" },
      { defId: "grigliato-giardino", position: [0, 0, 160], params: { larghezza: 300 }, material: "ruggine-patinata" },
      { defId: "fioriera", position: [-170, 0, 160], material: "vernice-nera" },
      { defId: "fioriera", position: [170, 0, 160], material: "vernice-nera" },
    ],
  },
  {
    id: "macro-tettoia-auto",
    nameIt: "Tettoia Auto",
    description: "Tettoia 5×3 con 2 colonne e trave",
    icon: "carport",
    elements: [
      { defId: "tettoia", position: [0, 0, 0], params: { larghezza: 500, profondita: 300 }, material: "zincato" },
      { defId: "colonna", position: [-220, 0, 130], params: { altezza: 250, diametro: 15 }, material: "zincato" },
      { defId: "colonna", position: [220, 0, 130], params: { altezza: 250, diametro: 15 }, material: "zincato" },
      { defId: "trave", position: [0, 240, 130], params: { lunghezza: 500 }, material: "zincato" },
    ],
  },
  {
    id: "macro-lanterna-giardino",
    nameIt: "Lanterna Giardino",
    description: "Lampione con lanterna e base decorativa",
    icon: "lamp",
    elements: [
      { defId: "lampione", position: [0, 0, 0], params: { altezza: 280 }, material: "ferro-battuto" },
      { defId: "lanterna", position: [0, 270, 0], material: "ottone-patinato" },
      { defId: "pannello-decorativo", position: [0, 0, 0], params: { larghezza: 60, altezza: 10 }, material: "ferro-battuto" },
    ],
  },
  {
    id: "macro-grata-finestra",
    nameIt: "Grata Finestra",
    description: "Finestra ferro con grata sicurezza sovrapposta",
    icon: "window",
    elements: [
      { defId: "finestra-ferro", position: [0, 0, 0], material: "vernice-nera" },
      { defId: "grata-sicurezza", position: [0, 0, 5], params: { larghezza: 120, altezza: 150 }, material: "zincato" },
    ],
  },
  {
    id: "macro-ingresso-arco",
    nameIt: "Ingresso Arco",
    description: "Arco con supporto insegna e insegna negozio",
    icon: "arch",
    elements: [
      { defId: "arco", position: [0, 0, 0], params: { larghezza: 300, altezza: 280 }, material: "ferro-battuto" },
      { defId: "supporto-insegna", position: [0, 260, 0], material: "ferro-battuto" },
      { defId: "insegna-negozio", position: [0, 290, 0], params: { larghezza: 200, altezza: 60 }, material: "cromo-lucido" },
    ],
  },
];
