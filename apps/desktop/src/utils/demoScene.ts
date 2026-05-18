import { useObjectStore } from "../stores/objectStore";
import { useSceneStore } from "../stores/sceneStore";
import { PARAMETRIC_LIBRARY } from "../stores/libraryStore";

export function loadDemoScene() {
  const clearScene = useObjectStore.getState().clearScene;
  const addObjects = useObjectStore.getState().addObjects;
  const setMaterial = useSceneStore.getState().setMaterial;
  const setHDRI = useSceneStore.getState().setHDRI;

  clearScene();

  const defs = PARAMETRIC_LIBRARY;
  const getDef = (id: string) => defs.find((d) => d.id === id)!;

  addObjects([
    {
      def: getDef("cancello-singolo"),
      materialId: "ferro-battuto",
      position: [0, 0, 0],
      params: { larghezza: 180, altezza: 220, spessore: 4, spaziatura: 10 },
    },
    {
      def: getDef("colonna"),
      materialId: "ferro-battuto",
      position: [-200, 0, 0],
      params: { altezza: 240, diametro: 20, spessore: 5, base: 40 },
    },
    {
      def: getDef("colonna"),
      materialId: "ferro-battuto",
      position: [200, 0, 0],
      params: { altezza: 240, diametro: 20, spessore: 5, base: 40 },
    },
    {
      def: getDef("arco"),
      materialId: "ruggine-patinata",
      position: [0, 0, -350],
      params: { larghezza: 300, altezza: 280, spessore: 5, raggio: 100 },
    },
    {
      def: getDef("scala-dritta"),
      materialId: "ferro-lucido",
      position: [0, 0, 350],
      params: { larghezza: 120, altezza: 300, spessore: 4, rampe: 12 },
    },
    {
      def: getDef("ringhiera"),
      materialId: "ferro-lucido",
      position: [-180, 0, 350],
      params: { larghezza: 160, altezza: 90, spessore: 2.5, barre: 5 },
    },
    {
      def: getDef("ringhiera"),
      materialId: "ferro-lucido",
      position: [180, 0, 350],
      params: { larghezza: 160, altezza: 90, spessore: 2.5, barre: 5 },
    },
    {
      def: getDef("lanterna"),
      materialId: "ottone-patinato",
      position: [200, 240, 0],
      params: { diametro: 25, altezza: 40, spessore: 2.5, bracci: 4 },
    },
    {
      def: getDef("fioriera"),
      materialId: "zincato",
      position: [-350, 0, 0],
      params: { larghezza: 80, altezza: 50, spessore: 2.5, profondita: 40 },
    },
    {
      def: getDef("fioriera"),
      materialId: "zincato",
      position: [350, 0, 0],
      params: { larghezza: 80, altezza: 50, spessore: 2.5, profondita: 40 },
    },
  ]);

  setMaterial("ferro-battuto");
  setHDRI("officina");
}
