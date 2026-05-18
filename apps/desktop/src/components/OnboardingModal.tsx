import { useEffect, useMemo } from "react";
import { useOnboardingStore, type OnboardingStep } from "../stores/onboardingStore";
import {
  BookOpen,
  Box,
  Layers,
  Move3D,
  Palette,
  Sun,
  Download,
  Calculator,
  Share2,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const STEP_META: Record<
  OnboardingStep,
  { title: string; text: string; icon: React.ReactNode; position: "left" | "center" | "right" | "bottom" }
> = {
  welcome: {
    title: "Benvenuto in FORGIA",
    text: "Disegna e configura elementi in ferro battuto in 3D. Esporta preventivi, preview e file per la produzione.",
    icon: <Sparkles className="w-6 h-6 text-forge-accent" />,
    position: "center",
  },
  library: {
    title: "Libreria",
    text: "Qui trovi cancello, recinzioni, scale, arredo urbano e molto altro. Clicca per aggiungere alla scena.",
    icon: <BookOpen className="w-5 h-5 text-forge-accent" />,
    position: "left",
  },
  macro: {
    title: "Composizioni Macro",
    text: "Usa le composizioni predefinite per aggiungere interi set di elementi in un clic.",
    icon: <Layers className="w-5 h-5 text-forge-accent" />,
    position: "left",
  },
  viewport: {
    title: "Viewport 3D",
    text: "Ruota con il tasto sinistro, zoom con la rotella, pan con il tasto destro. Cambia camera con i pulsanti sopra.",
    icon: <Move3D className="w-5 h-5 text-forge-accent" />,
    position: "center",
  },
  properties: {
    title: "Proprietà",
    text: "Seleziona un oggetto per modificarne dimensioni, posizione e rotazione in tempo reale.",
    icon: <Box className="w-5 h-5 text-forge-accent" />,
    position: "right",
  },
  materials: {
    title: "Materiali",
    text: "Applica ferro battuto, acciaio zincato, verniciatura e altre finiture PBR.",
    icon: <Palette className="w-5 h-5 text-forge-accent" />,
    position: "right",
  },
  hdri: {
    title: "Illuminazione HDRI",
    text: "Scegli l'ambient lighting per valutare il metallo sotto diverse condizioni di luce.",
    icon: <Sun className="w-5 h-5 text-forge-accent" />,
    position: "right",
  },
  export: {
    title: "Esporta",
    text: "Scarica screenshot, file 3D (GLTF/OBJ) o genera un PDF preventivo professionale.",
    icon: <Download className="w-5 h-5 text-forge-accent" />,
    position: "center",
  },
  quote: {
    title: "Preventivo",
    text: "Il calcolatore peso stima il ferro necessario. Apri il pannello Preventivo per tariffe e PDF.",
    icon: <Calculator className="w-5 h-5 text-forge-accent" />,
    position: "center",
  },
  preview: {
    title: "Preview Cloud",
    text: "Condividi la scena via link. Chiunque può visualizzarla su forgia.app/p/{uuid}.",
    icon: <Share2 className="w-5 h-5 text-forge-accent" />,
    position: "center",
  },
  done: {
    title: "Pronto",
    text: "Hai completato il tutorial. Inizia a creare!",
    icon: <Sparkles className="w-6 h-6 text-forge-accent" />,
    position: "center",
  },
};

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "library",
  "macro",
  "viewport",
  "properties",
  "materials",
  "hdri",
  "export",
  "quote",
  "preview",
  "done",
];

export default function OnboardingModal() {
  const { show, step, nextStep, prevStep, skip, restart } = useOnboardingStore();

  useEffect(() => {
    if (!show) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
      if (e.key === "Escape") skip();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, nextStep, prevStep, skip]);

  const meta = STEP_META[step];
  const stepIndex = STEP_ORDER.indexOf(step);

  const positionClasses = useMemo(() => {
    switch (meta.position) {
      case "left":
        return "left-4 top-1/2 -translate-y-1/2";
      case "right":
        return "right-4 top-1/2 -translate-y-1/2";
      case "bottom":
        return "bottom-4 left-1/2 -translate-x-1/2";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  }, [meta.position]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={skip} />

      {/* Spotlight hints (visual only, no cutout for simplicity) */}
      {meta.position === "left" && (
        <div className="absolute left-0 top-12 bottom-0 w-64 border-2 border-forge-accent/40 rounded-r-lg pointer-events-none" />
      )}
      {meta.position === "right" && (
        <div className="absolute right-0 top-12 bottom-0 w-64 border-2 border-forge-accent/40 rounded-l-lg pointer-events-none" />
      )}
      {meta.position === "center" && (
        <div className="absolute left-64 right-64 top-12 bottom-0 border-2 border-forge-accent/40 rounded-lg pointer-events-none" />
      )}

      {/* Card */}
      <div
        className={`absolute ${positionClasses} w-80 bg-forge-800 border border-forge-600 rounded-xl shadow-2xl p-5 space-y-4 animate-fade-in`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span className="text-sm font-semibold text-gray-200">{meta.title}</span>
          </div>
          <button
            onClick={skip}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Chiudi tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text */}
        <p className="text-sm text-gray-300 leading-relaxed">{meta.text}</p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {STEP_ORDER.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i <= stepIndex ? "bg-forge-accent" : "bg-forge-600"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={prevStep}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Indietro
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={skip}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Salta
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-forge-accent text-forge-900 text-xs font-semibold hover:bg-[#dcc060] transition-colors"
            >
              {step === "preview" ? "Fine" : "Avanti"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Restart button (hidden, appears on hover of a corner) */}
      <button
        onClick={restart}
        className="absolute bottom-2 right-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1"
        title="Rifai tutorial"
      >
        <RotateCcw className="w-3 h-3" />
        Tutorial
      </button>
    </div>
  );
}
