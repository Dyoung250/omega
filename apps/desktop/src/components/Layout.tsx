import { ReactNode, useState, useRef, useEffect } from "react";
import {
  useSceneStore,
  MATERIALS,
  HDRI_PRESETS,
} from "../stores/sceneStore";
import { useCameraStore, CAMERA_PRESETS } from "../stores/cameraStore";
import { useObjectStore } from "../stores/objectStore";
import {
  CATEGORIES,
  PARAMETRIC_LIBRARY,
  getLibraryByCategory,
  evaluateWeight,
} from "../stores/libraryStore";
import { exportScreenshot, exportGLTF, exportOBJ } from "../utils/exportManager";
import { buildPreviewData, uploadPreview } from "../utils/exportPreview";
import { loadDemoScene } from "../utils/demoScene";
import { useToastStore } from "../stores/toastStore";
import ToastContainer from "./ToastContainer";
import AuthModal from "./AuthModal";
import HelpModal from "./HelpModal";
import { useAuthStore } from "../stores/authStore";
import { useQuoteStore } from "../stores/quoteStore";
import { useLicenseStore } from "../stores/licenseStore";
import { useOnboardingStore } from "../stores/onboardingStore";
import { MACRO_LIBRARY } from "../stores/macroStore";
import type { ParametricDef } from "@forgia/shared";
import QuotePanel from "./QuotePanel";
import LicenseModal from "./LicenseModal";
import OnboardingModal from "./OnboardingModal";

interface LayoutProps {
  children: ReactNode;
}

function LibraryItem({ def, onAdd }: { def: ParametricDef; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="flex flex-col items-center justify-center gap-1 h-20 bg-forge-700 hover:bg-forge-600 hover:border-forge-accent/40 rounded border border-forge-500/50 p-2 transition-all duration-200 animate-slide-up group"
      title={`Aggiungi ${def.nameIt}`}
    >
      <span className="text-xs text-gray-300 font-medium text-center leading-tight group-hover:text-forge-accent transition-colors">
        {def.nameIt}
      </span>
      <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">
        {def.paramDefs[0].default}×{def.paramDefs[1].default} cm
      </span>
    </button>
  );
}

function MacroItem({ macro, onApply }: { macro: typeof MACRO_LIBRARY[0]; onApply: () => void }) {
  return (
    <button
      onClick={onApply}
      className="flex flex-col items-start justify-center gap-1 h-14 bg-forge-700 hover:bg-forge-600 hover:border-forge-accent/40 rounded border border-forge-500/50 p-2 transition-all duration-200 animate-slide-up group w-full text-left"
      title={macro.description}
    >
      <span className="text-xs text-gray-300 font-medium leading-tight group-hover:text-forge-accent transition-colors truncate w-full">
        {macro.nameIt}
      </span>
      <span className="text-[10px] text-forge-accent/60 font-mono">
        {macro.elements.length} elementi
      </span>
    </button>
  );
}

function MaterialSwatch({
  mat,
  active,
  onClick,
}: {
  mat: (typeof MATERIALS)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Materiale ${mat.nameIt}`}
      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs transition-colors ${
        active
          ? "bg-forge-accent/20 text-forge-accent border border-forge-accent/40"
          : "bg-forge-700 text-gray-300 border border-forge-500/30 hover:bg-forge-600"
      }`}
    >
      <span
        className="w-4 h-4 rounded-full border border-white/10 shrink-0"
        style={{ backgroundColor: mat.color }}
      />
      <span className="truncate">{mat.nameIt}</span>
    </button>
  );
}

function HDRIChip({
  preset,
  active,
  onClick,
}: {
  preset: (typeof HDRI_PRESETS)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs transition-colors ${
        active
          ? "bg-forge-accent/20 text-forge-accent border border-forge-accent/40"
          : "bg-forge-700 text-gray-400 border border-forge-500/30 hover:bg-forge-600"
      }`}
    >
      {preset.name}
    </button>
  );
}

function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const addToastExp = useToastStore((s) => s.addToast);

  const items = [
    { label: "Screenshot PNG", action: () => { exportScreenshot(); addToastExp("Screenshot salvato", "success"); } },
    { label: "Esporta GLB", action: () => { exportGLTF({ binary: true }); addToastExp("Esportazione GLB avviata", "success"); } },
    { label: "Esporta GLTF", action: () => { exportGLTF({ binary: false }); addToastExp("Esportazione GLTF avviata", "success"); } },
    { label: "Esporta OBJ", action: () => { exportOBJ(); addToastExp("Esportazione OBJ avviata", "success"); } },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-forge-700 text-gray-400 border border-forge-500/30 hover:bg-forge-600 hover:text-gray-200 transition-colors"
      >
        <span>Esporta</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-44 bg-forge-800 border border-forge-600 rounded shadow-lg z-50 overflow-hidden">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-forge-700 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TransformField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-400 w-12">{label}</span>
      <input
        type="number"
        aria-label={`${label} in ${unit}`}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-xs font-mono text-gray-300 bg-forge-700 px-2 py-0.5 rounded w-16 text-right border border-forge-500/30 focus:border-forge-accent outline-none"
      />
      <span className="text-xs text-gray-500 w-5">{unit}</span>
    </div>
  );
}

function ParamField({
  def,
  value,
  onChange,
}: {
  def: { label: string; unit: string; min: number; max: number; step: number };
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-400 w-20 truncate">{def.label}</span>
      <input
        type="number"
        aria-label={`${def.label} in ${def.unit}`}
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-xs font-mono text-gray-300 bg-forge-700 px-2 py-0.5 rounded w-16 text-right border border-forge-500/30 focus:border-forge-accent outline-none"
      />
      <span className="text-xs text-gray-500 w-6">{def.unit}</span>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const activeMaterial = useSceneStore((s) => s.activeMaterial);
  const activeHDRI = useSceneStore((s) => s.activeHDRI);
  const setHDRI = useSceneStore((s) => s.setHDRI);
  const viewMode = useSceneStore((s) => s.viewMode);
  const setViewMode = useSceneStore((s) => s.setViewMode);
  const snapEnabled = useSceneStore((s) => s.snapEnabled);
  const snapSize = useSceneStore((s) => s.snapSize);
  const mirrorEnabled = useSceneStore((s) => s.mirrorEnabled);
  const mirrorAxis = useSceneStore((s) => s.mirrorAxis);
  const dimensionsEnabled = useSceneStore((s) => s.dimensionsEnabled);
  const toggleSnap = useSceneStore((s) => s.toggleSnap);
  const toggleMirror = useSceneStore((s) => s.toggleMirror);
  const toggleDimensions = useSceneStore((s) => s.toggleDimensions);
  const setMirrorAxis = useSceneStore((s) => s.setMirrorAxis);

  const cameraMode = useCameraStore((s) => s.mode);
  const setCameraMode = useCameraStore((s) => s.setMode);
  const applyCameraPreset = useCameraStore((s) => s.applyPreset);

  const objects = useObjectStore((s) => s.objects);
  const selectedId = useObjectStore((s) => s.selectedId);
  const addObject = useObjectStore((s) => s.addObject);
  const addObjects = useObjectStore((s) => s.addObjects);
  const clearScene = useObjectStore((s) => s.clearScene);
  const selectObject = useObjectStore((s) => s.selectObject);
  const removeObject = useObjectStore((s) => s.removeObject);
  const updateTransform = useObjectStore((s) => s.updateTransform);
  const updateParam = useObjectStore((s) => s.updateParam);
  const updateMaterial = useObjectStore((s) => s.updateMaterial);

  const selectedObj = objects.find((o) => o.id === selectedId);
  const selectedDef = PARAMETRIC_LIBRARY.find((d) => d.id === selectedObj?.defId);

  const [showHelp, setShowHelp] = useState(false);
  const [exportingPreview, setExportingPreview] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setShowAuthModal = useAuthStore((s) => s.setShowAuthModal);
  const signOut = useAuthStore((s) => s.signOut);
  const initSession = useAuthStore((s) => s.initSession);

  const isLicensed = useLicenseStore((s) => s.isLicensed);
  const isTrial = useLicenseStore((s) => s.isTrial);
  const isExpired = useLicenseStore((s) => s.isExpired);
  const trialDaysLeft = useLicenseStore((s) => s.trialDaysLeft);
  const setShowLicenseModal = useLicenseStore((s) => s.setShowLicenseModal);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    useLicenseStore.getState().checkLicense();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (showHelp && e.key === "Escape") {
        setShowHelp(false);
        return;
      }
      if (showHelp) return;

      if (e.key === "1") {
        e.preventDefault();
        setViewMode("3d");
      } else if (e.key === "2") {
        e.preventDefault();
        setViewMode("2d-top");
      } else if (e.key === "3") {
        e.preventDefault();
        setViewMode("ai-scan");
      } else if (e.key === "Tab") {
        e.preventDefault();
        const idx = objects.findIndex((o) => o.id === selectedId);
        const next = objects[idx + 1] || objects[0];
        if (next) selectObject(next.id);
      } else if (e.key === "Delete" && selectedId) {
        e.preventDefault();
        removeObject(selectedId);
      } else if (e.key === "g" || e.key === "G") {
        if (e.ctrlKey) {
          e.preventDefault();
          exportGLTF({ binary: true });
        } else {
          e.preventDefault();
          toggleSnap();
        }
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMirror();
      } else if (e.key === "?") {
        e.preventDefault();
        setShowHelp(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showHelp, objects, selectedId, setViewMode, selectObject, removeObject, toggleSnap, toggleMirror, setShowHelp]);

  const libraryByCat = getLibraryByCategory();

  const handleAdd = (def: ParametricDef) => {
    addObject(def, activeMaterial);
    addToast(`Aggiunto: ${def.nameIt}`, "success");
  };

  const handleApplyMacro = (macroId: string) => {
    const macro = MACRO_LIBRARY.find((m) => m.id === macroId);
    if (!macro) return;

    const items = macro.elements
      .map((el) => {
        const def = PARAMETRIC_LIBRARY.find((d) => d.id === el.defId);
        if (!def) return null;
        return {
          def,
          materialId: el.material ?? activeMaterial,
          position: el.position,
          rotation: el.rotation,
          scale: el.scale,
          params: el.params,
        };
      })
      .filter(Boolean) as Parameters<typeof addObjects>[0];

    addObjects(items);
    addToast(`Composizione applicata: ${macro.nameIt} (${items.length} elementi)`, "success");
  };

  return (
    <div className="flex h-full w-full bg-forge-900">
      {/* Left Panel — Parametric Library */}
      <aside className="w-64 flex-shrink-0 bg-forge-800 border-r border-forge-600 flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-forge-600">
          <span className="text-forge-accent font-bold text-sm tracking-wide">
            FORGIA Ω
          </span>
          <button
            onClick={() => setShowLicenseModal(true)}
            className={`ml-2 text-[10px] px-1.5 py-0.5 rounded transition-colors ${
              isExpired
                ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                : isTrial
                ? "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50"
                : "bg-green-900/30 text-green-400 hover:bg-green-900/50"
            }`}
            title="Gestisci licenza"
          >
            {isLicensed ? "Pro" : isTrial ? `Trial ${trialDaysLeft}d` : "Scaduta"}
          </button>
          <span className="ml-auto text-xs text-gray-500">v0.1.0</span>
        </div>
        <div className="px-3 py-2 border-b border-forge-700">
          <button
            onClick={() => {
              clearScene();
              addToast("Scena svuotata", "warning");
            }}
            className="w-full py-1.5 rounded text-[10px] bg-forge-700 text-gray-400 border border-forge-500/30 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/30 transition-colors"
          >
            Pulisci Scena
          </button>
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-4 scrollbar-thin">
          {/* Macros */}
          <div>
            <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
              Composizioni Macro
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MACRO_LIBRARY.map((macro) => (
                <MacroItem
                  key={macro.id}
                  macro={macro}
                  onApply={() => handleApplyMacro(macro.id)}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-forge-600" />

          {/* Categories */}
          {Object.entries(libraryByCat).map(([catKey, defs]) => (
            <div key={catKey}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {CATEGORIES[catKey as keyof typeof CATEGORIES]?.name ?? catKey}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {defs.map((def) => (
                  <LibraryItem key={def.id} def={def} onAdd={() => handleAdd(def)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Center — Viewport */}
      <main className="flex-1 relative flex flex-col">
        {/* Toolbar */}
        <div className="h-9 bg-forge-800 border-b border-forge-600 flex items-center px-3 gap-3 shrink-0">
          {/* View Mode */}
          <div className="flex items-center gap-1 bg-forge-700 rounded p-0.5">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                viewMode === "3d"
                  ? "bg-forge-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              3D
            </button>
            <button
              onClick={() => setViewMode("2d-top")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                viewMode === "2d-top"
                  ? "bg-forge-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Vista dall'alto
            </button>
            <button
              onClick={() => setViewMode("ai-scan")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                viewMode === "ai-scan"
                  ? "bg-forge-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              AI Scan
            </button>
          </div>

          {viewMode !== "ai-scan" && (
            <>
              <div className="w-px h-5 bg-forge-600" />

              {/* Camera Mode */}
              <div className="flex items-center gap-1 bg-forge-700 rounded p-0.5">
                <button
                  onClick={() => setCameraMode("orbit")}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    cameraMode === "orbit"
                      ? "bg-forge-600 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Orbita
                </button>
                <button
                  onClick={() => setCameraMode("fly")}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    cameraMode === "fly"
                      ? "bg-forge-600 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Volo
                </button>
              </div>

              <div className="w-px h-5 bg-forge-600" />

              {/* Camera Presets */}
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyCameraPreset(preset.id)}
                  className="px-2 py-0.5 rounded text-xs bg-forge-700 text-gray-400 border border-forge-500/30 hover:bg-forge-600 hover:text-gray-200 transition-colors"
                >
                  {preset.nameIt}
                </button>
              ))}

              <div className="w-px h-5 bg-forge-600" />

              {/* Snap */}
              <button
                onClick={toggleSnap}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors ${
                  snapEnabled
                    ? "bg-forge-accent/20 text-forge-accent border-forge-accent/40"
                    : "bg-forge-700 text-gray-400 border-forge-500/30"
                }`}
              >
                <span>Snap</span>
                <span className="text-[10px] opacity-70">{snapSize}cm</span>
              </button>

              <div className="w-px h-5 bg-forge-600" />

              {/* Mirror */}
              <button
                onClick={toggleMirror}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors ${
                  mirrorEnabled
                    ? "bg-forge-accent/20 text-forge-accent border-forge-accent/40"
                    : "bg-forge-700 text-gray-400 border-forge-500/30"
                }`}
              >
                <span>Simmetria</span>
              </button>
              {mirrorEnabled && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMirrorAxis("x")}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      mirrorAxis === "x" ? "text-forge-accent bg-forge-accent/10" : "text-gray-500"
                    }`}
                  >
                    Asse X
                  </button>
                  <button
                    onClick={() => setMirrorAxis("z")}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      mirrorAxis === "z" ? "text-forge-accent bg-forge-accent/10" : "text-gray-500"
                    }`}
                  >
                    Asse Z
                  </button>
                </div>
              )}

              <div className="w-px h-5 bg-forge-600" />

              {/* Dimensions */}
              <button
                onClick={toggleDimensions}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors ${
                  dimensionsEnabled
                    ? "bg-forge-accent/20 text-forge-accent border-forge-accent/40"
                    : "bg-forge-700 text-gray-400 border-forge-500/30"
                }`}
              >
                <span>Quote</span>
              </button>
            </>
          )}

          <button
            onClick={loadDemoScene}
            className="text-[10px] px-2 py-1 rounded bg-forge-accent text-forge-900 font-medium hover:bg-forge-accent/90 transition-colors"
            title="Carica scena dimostrativa"
          >
            Demo
          </button>

          <div className="flex-1" />

          {viewMode !== "ai-scan" && <ExportDropdown />}

          {viewMode !== "ai-scan" && (
            <>
              <button
                onClick={() => useQuoteStore.getState().setShowQuotePanel(true)}
                className="text-[10px] px-2 py-1 rounded bg-forge-700 text-gray-300 hover:bg-forge-600 hover:text-forge-accent transition-colors"
                title="Apri preventivo"
              >
                Preventivo
              </button>
              <button
                onClick={async () => {
                  if (!user) {
                    setShowAuthModal(true);
                    return;
                  }
                  setExportingPreview(true);
                  try {
                    const sceneData = buildPreviewData();
                    const result = await uploadPreview(null, sceneData);
                    if (result) {
                      addToast("Preview condivisa: " + result.url);
                      navigator.clipboard.writeText(result.url);
                    }
                  } catch (err: any) {
                    addToast(err.message ?? "Errore export preview");
                  } finally {
                    setExportingPreview(false);
                  }
                }}
                disabled={exportingPreview}
                className="text-[10px] px-2 py-1 rounded bg-forge-700 text-gray-300 hover:bg-forge-600 hover:text-forge-accent transition-colors disabled:opacity-50"
                title="Condividi preview cloud"
              >
                {exportingPreview ? "..." : "Preview"}
              </button>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">
                {profile?.display_name ?? user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-[10px] px-2 py-1 rounded bg-forge-700 text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
              >
                Esci
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-[10px] px-2 py-1 rounded bg-forge-accent text-forge-900 font-medium hover:bg-forge-accent/90 transition-colors"
            >
              Accedi
            </button>
          )}

          <button
            onClick={() => useOnboardingStore.getState().restart()}
            className="text-gray-500 hover:text-forge-accent transition-colors"
            title="Rifai tutorial"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            title="Scorciatoie da tastiera"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

        </div>

        {children}

        {/* Bottom — Hierarchy */}
        <div className="h-10 bg-forge-800 border-t border-forge-600 flex items-center px-3 gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-xs text-gray-500 uppercase tracking-wider mr-2">Gerarchia</span>
          {objects.length === 0 && (
            <span className="text-xs text-gray-600 italic animate-fade-in">Clicca un elemento dalla libreria per aggiungere alla scena</span>
          )}
          {objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all duration-200 animate-scale-in ${
                obj.id === selectedId
                  ? "bg-forge-accent/20 text-forge-accent border border-forge-accent/40"
                  : "bg-forge-700 text-gray-300 border border-forge-500/30 hover:bg-forge-600"
              }`}
            >
              <span className="max-w-[120px] truncate">{obj.name}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeObject(obj.id);
                  addToast("Oggetto rimosso", "warning");
                }}
                className="text-gray-500 hover:text-red-400 ml-1 cursor-pointer transition-colors"
              >
                ×
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Right Panel — Properties */}
      <aside className="w-72 flex-shrink-0 bg-forge-800 border-l border-forge-600 flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-forge-600">
          <span className="text-sm font-medium text-gray-300">Proprietà</span>
          <span className="ml-auto text-xs text-gray-500">FORGIA Ω v0.1.0</span>
        </div>
        <div className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin">
          {selectedObj && selectedDef ? (
            <>
              {/* Transform */}
              <div>
                <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
                  Trasformazione
                </p>
                <div className="space-y-1.5">
                  {["Pos X", "Pos Y", "Pos Z"].map((label, i) => (
                    <TransformField
                      key={label}
                      label={label}
                      value={selectedObj.transform.position[i]}
                      unit="cm"
                      onChange={(v) => updateTransform(selectedObj.id, "position", i, v)}
                    />
                  ))}
                  {["Rot X", "Rot Y", "Rot Z"].map((label, i) => (
                    <TransformField
                      key={label}
                      label={label}
                      value={selectedObj.transform.rotation[i]}
                      unit="°"
                      onChange={(v) => updateTransform(selectedObj.id, "rotation", i, v)}
                    />
                  ))}
                  <TransformField
                    label="Scala"
                    value={selectedObj.transform.scale[0]}
                    unit=""
                    onChange={(v) => {
                      updateTransform(selectedObj.id, "scale", 0, v);
                      updateTransform(selectedObj.id, "scale", 1, v);
                      updateTransform(selectedObj.id, "scale", 2, v);
                    }}
                  />
                </div>
              </div>

              {/* Params */}
              <div>
                <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
                  Parametri
                </p>
                <div className="space-y-1.5">
                  {selectedDef.paramDefs.map((pd) => (
                    <ParamField
                      key={pd.key}
                      def={pd}
                      value={Number(selectedObj.params[pd.key] ?? pd.default)}
                      onChange={(v) => updateParam(selectedObj.id, pd.key, v)}
                    />
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
                  Materiale
                </p>
                <div className="space-y-1.5">
                  {MATERIALS.map((mat) => (
                    <MaterialSwatch
                      key={mat.id}
                      mat={mat}
                      active={selectedObj.material === mat.id}
                      onClick={() => updateMaterial(selectedObj.id, mat.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Weight & Price */}
              <div>
                <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
                  Peso & Prezzo
                </p>
                <div className="bg-forge-700 rounded border border-forge-500/30 p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Peso stimato</span>
                    <span className="text-xs font-mono text-gray-200">
                      {evaluateWeight(selectedDef.weightFormula, selectedObj.params).toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Prezzo</span>
                    <span className="text-xs font-mono text-forge-accent">
                      €{" "}
                      {(
                        evaluateWeight(selectedDef.weightFormula, selectedObj.params) *
                        selectedDef.pricePerKg
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500 text-center mt-8">
              Seleziona un oggetto per modificarne le proprietà
            </div>
          )}

          {/* BOM / Quotazione Tecnica */}
          {objects.length > 0 && (
            <div>
              <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
                Quotazione Tecnica — {objects.length} elementi
              </p>
              <div className="bg-forge-700 rounded border border-forge-500/30 overflow-hidden">
                <div className="max-h-48 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-[10px]">
                    <thead className="bg-forge-600 sticky top-0">
                      <tr>
                        <th className="text-left px-2 py-1 text-gray-400 font-normal">Elemento</th>
                        <th className="text-right px-2 py-1 text-gray-400 font-normal">Dim.</th>
                        <th className="text-right px-2 py-1 text-gray-400 font-normal">Peso</th>
                        <th className="text-right px-2 py-1 text-gray-400 font-normal">Prezzo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {objects.map((obj) => {
                        const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
                        if (!def) return null;
                        const w = evaluateWeight(def.weightFormula, obj.params);
                        const price = w * def.pricePerKg;
                        const l = Number(obj.params.larghezza ?? def.defaultParams.larghezza ?? 0);
                        const h = Number(obj.params.altezza ?? def.defaultParams.altezza ?? 0);
                        return (
                          <tr
                            key={obj.id}
                            onClick={() => selectObject(obj.id)}
                            className={`border-t border-forge-500/20 cursor-pointer transition-colors ${
                              obj.id === selectedId ? "bg-forge-accent/10" : "hover:bg-forge-600/50"
                            }`}
                          >
                            <td className="px-2 py-1 text-gray-300 truncate max-w-[80px]">{obj.name}</td>
                            <td className="px-2 py-1 text-gray-400 text-right font-mono">{l.toFixed(0)}×{h.toFixed(0)}</td>
                            <td className="px-2 py-1 text-gray-400 text-right font-mono">{w.toFixed(1)}kg</td>
                            <td className="px-2 py-1 text-forge-accent text-right font-mono">€{price.toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-forge-600/50 border-t border-forge-500/30">
                      <tr>
                        <td className="px-2 py-1.5 text-gray-300 font-medium" colSpan={2}>Totale</td>
                        <td className="px-2 py-1.5 text-gray-200 text-right font-mono font-medium">
                          {objects.reduce((sum, obj) => {
                            const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
                            return sum + (def ? evaluateWeight(def.weightFormula, obj.params) : 0);
                          }, 0).toFixed(1)} kg
                        </td>
                        <td className="px-2 py-1.5 text-forge-accent text-right font-mono font-bold">
                          €{objects.reduce((sum, obj) => {
                            const def = PARAMETRIC_LIBRARY.find((d) => d.id === obj.defId);
                            return sum + (def ? evaluateWeight(def.weightFormula, obj.params) * def.pricePerKg : 0);
                          }, 0).toFixed(0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HDRI */}
          <div>
            <p className="text-xs text-forge-accent uppercase tracking-wider mb-2 font-semibold">
              Ambient HDRI
            </p>
            <div className="flex gap-2 flex-wrap">
              {HDRI_PRESETS.map((preset) => (
                <HDRIChip
                  key={preset.id}
                  preset={preset}
                  active={activeHDRI === preset.id}
                  onClick={() => setHDRI(preset.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <QuotePanel />

      <ToastContainer />

      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
      <AuthModal />
      <LicenseModal />
      <OnboardingModal />
    </div>
  );
}
