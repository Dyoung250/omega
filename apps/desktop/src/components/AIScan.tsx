import { useCallback, useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAIScanStore, type ScanResult } from "../stores/aiScanStore";
import { useObjectStore } from "../stores/objectStore";
import { useSceneStore } from "../stores/sceneStore";
import { PARAMETRIC_LIBRARY } from "../stores/libraryStore";

function UploadZone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files);
      }
    },
    [onFiles]
  );

  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        dragActive
          ? "border-forge-accent bg-forge-accent/10"
          : "border-forge-600 bg-forge-800/50 hover:border-forge-500 hover:bg-forge-800"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        aria-label="Carica file scansione"
        title="Carica file"
        multiple
        accept="image/*,.obj,.stl,.ply,.glb,.gltf"
        className="hidden"
        onChange={handleChange}
      />
      <svg
        className="w-12 h-12 text-gray-500 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p className="text-sm text-gray-300 font-medium">
        Trascina foto o modello 3D qui
      </p>
      <p className="text-xs text-gray-500 mt-1">
        JPG, PNG, OBJ, STL, PLY, GLB
      </p>
      <p className="text-[10px] text-gray-600 mt-3">
        Max 50MB · Più foto = maggiore precisione
      </p>
    </div>
  );
}

function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-forge-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-forge-accent rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function WireframePreview() {
  return (
    <div className="flex items-center justify-center h-48 bg-forge-900 rounded-lg border border-forge-700">
      <div className="relative w-32 h-32">
        {/* Wireframe cube placeholder */}
        <svg
          className="w-full h-full text-forge-accent animate-pulse"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <path d="M20 30 L50 15 L80 30 L50 45 Z" />
          <path d="M20 30 L20 70 L50 85 L50 45 Z" />
          <path d="M50 45 L50 85 L80 70 L80 30 Z" />
          <path d="M20 70 L50 85 L80 70" />
          <path d="M35 37 L35 77" strokeDasharray="2 2" />
          <path d="M65 37 L65 77" strokeDasharray="2 2" />
          <path d="M35 37 L65 37" strokeDasharray="2 2" />
          <path d="M35 77 L65 77" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-forge-accent font-mono bg-forge-900/80 px-2 py-0.5 rounded">
            3D RECONSTRUCTION
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  active,
  onClick,
}: {
  result: ScanResult;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        active
          ? "bg-forge-accent/10 border-forge-accent/40"
          : "bg-forge-800 border-forge-700 hover:border-forge-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-forge-700 rounded flex items-center justify-center shrink-0">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-300 font-medium truncate">
            {result.name}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {result.estimatedDimensions.width}×{result.estimatedDimensions.height}×
            {result.estimatedDimensions.depth} cm ·{" "}
            {result.estimatedWeight.toFixed(1)} kg
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                result.confidence > 0.8
                  ? "bg-green-900/30 text-green-400"
                  : result.confidence > 0.5
                  ? "bg-yellow-900/30 text-yellow-400"
                  : "bg-red-900/30 text-red-400"
              }`}
            >
              Confidenza {(result.confidence * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-gray-600">
              {result.pointCount.toLocaleString()} punti
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function AIScan() {
  const store = useAIScanStore();
  const { stage, progress, currentFile, results, selectedResultId, sidecarAvailable, sidecarError } = store;
  const [vectorizing, setVectorizing] = useState(false);
  const [vectorizeError, setVectorizeError] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const fileDataRef = useRef<string | null>(null);

  const addObjects = useObjectStore((s) => s.addObjects);
  const activeMaterial = useSceneStore((s) => s.activeMaterial);

  // Check sidecar availability on mount
  useEffect(() => {
    invoke("ai_scan_check")
      .then((res: any) => {
        store.setSidecarStatus(res.ok, res.ok ? null : res.error);
      })
      .catch((err) => {
        store.setSidecarStatus(false, String(err));
      });
  }, []);

  const processWithSidecar = useCallback(
    async (file: File) => {
      store.setCurrentFile(file.name);
      store.setStage("uploading");
      store.setProgress(20);

      try {
        // Read file as base64
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);
        fileDataRef.current = b64;

        store.setProgress(50);
        store.setStage("processing");

        const result: any = await invoke("ai_scan_process_b64", {
          imageB64: b64,
          outputDir: "./ai-scan-output",
        });

        store.setProgress(100);

        if (result.status === "error") {
          throw new Error(result.error || "Sidecar processing failed");
        }

        const id = `scan-${Date.now()}`;
        store.addResult({
          id,
          name: file.name,
          estimatedDimensions: result.estimated_dimensions || {
            width: 100,
            height: 100,
            depth: 20,
          },
          estimatedWeight: result.estimated_weight || 10,
          confidence: result.confidence || 0.7,
          thumbnail: result.thumbnail_b64 || "",
          pointCount: result.point_count || 0,
          processedImage: result.output_image || "",
        });
        store.setStage("complete");
        store.selectResult(id);
      } catch (err) {
        console.error("AI Scan error:", err);
        store.setStage("error");
        store.setSidecarStatus(false, String(err));
      }
    },
    [store]
  );

  const updateResult = useAIScanStore((s) => s.updateResult);

  const vectorizeWithSidecar = useCallback(
    async () => {
      if (!fileDataRef.current) return;
      setVectorizing(true);
      setVectorizeError(null);
      try {
        const result: any = await invoke("ai_scan_vectorize_b64", {
          imageB64: fileDataRef.current,
          outputDir: "./ai-scan-output",
        });
        if (result.status === "error") {
          throw new Error(result.error || "Vectorization failed");
        }
        if (selectedResultId) {
          updateResult(selectedResultId, { svgContent: result.svg_content || "" });
        }
      } catch (err) {
        console.error("Vectorize error:", err);
        setVectorizeError(String(err));
      } finally {
        setVectorizing(false);
      }
    },
    [selectedResultId, updateResult]
  );

  const analyseWithSidecar = useCallback(
    async () => {
      if (!fileDataRef.current) return;
      setAnalysing(true);
      setAnalysisError(null);
      try {
        const result: any = await invoke("ai_scan_analyse_b64", {
          imageB64: fileDataRef.current,
        });
        if (result.status === "error") {
          throw new Error(result.error || "Analysis failed");
        }
        if (selectedResultId) {
          const analysis = {
            tipo_struttura: result.tipo_struttura || "sconosciuto",
            elementi_identificati: result.elementi_identificati || [],
            pattern_geometrico: result.pattern_geometrico || "sconosciuto",
            simmetria: result.simmetria || "media",
            dimensioni_stimate: result.dimensioni_stimate || { larghezza: 100, altezza: 100, profondita: 10 },
            raccomandazioni_fabbricazione: result.raccomandazioni_fabbricazione || [],
            confidence: result.confidence || 0.5,
            source: result.source || "unknown",
            metrics: result.metrics || undefined,
          };
          updateResult(selectedResultId, { structuralAnalysis: analysis });
        }
      } catch (err) {
        console.error("Analysis error:", err);
        setAnalysisError(String(err));
      } finally {
        setAnalysing(false);
      }
    },
    [selectedResultId, updateResult]
  );

  const matchWithLibrary = useCallback(
    async () => {
      const result = results.find((r) => r.id === selectedResultId);
      if (!result?.structuralAnalysis) return;
      setMatching(true);
      setMatchError(null);
      try {
        const analysisJson = JSON.stringify(result.structuralAnalysis);
        const b64 = btoa(analysisJson);
        const res: any = await invoke("ai_scan_match_library", { analysisJson: b64 });
        if (res.status === "error") {
          throw new Error(res.error || "Matching failed");
        }
        const best = res.bestMatch;
        if (best && selectedResultId) {
          updateResult(selectedResultId, {
            libraryMatch: {
              defId: best.defId,
              nameIt: best.nameIt,
              category: best.category,
              score: best.score,
              confidence: best.confidence,
              suggestedParams: best.suggestedParams || {},
              paramKeys: best.paramKeys || [],
            },
          });
        }
      } catch (err) {
        console.error("Match error:", err);
        setMatchError(String(err));
      } finally {
        setMatching(false);
      }
    },
    [selectedResultId, results, updateResult]
  );

  const handleImportToScene = useCallback(() => {
    const result = results.find((r) => r.id === selectedResultId);
    if (!result?.libraryMatch) return;
    const match = result.libraryMatch;
    const def = PARAMETRIC_LIBRARY.find((d) => d.id === match.defId);
    if (!def) return;
    addObjects([
      {
        def,
        materialId: activeMaterial,
        params: match.suggestedParams,
      },
    ]);
  }, [selectedResultId, results, addObjects, activeMaterial]);

  const simulateProcessing = useCallback(
    (fileName: string) => {
      store.setCurrentFile(fileName);
      store.setStage("uploading");
      store.setProgress(0);

      let p = 0;
      const uploadInterval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) {
          clearInterval(uploadInterval);
          store.setProgress(100);
          setTimeout(() => {
            store.setStage("processing");
            store.setProgress(0);
            let q = 0;
            const processInterval = setInterval(() => {
              q += Math.random() * 8 + 3;
              if (q >= 100) {
                clearInterval(processInterval);
                store.setProgress(100);
                setTimeout(() => {
                  const id = `scan-${Date.now()}`;
                  store.addResult({
                    id,
                    name: fileName,
                    estimatedDimensions: {
                      width: Math.round(50 + Math.random() * 200),
                      height: Math.round(30 + Math.random() * 150),
                      depth: Math.round(10 + Math.random() * 50),
                    },
                    estimatedWeight: Math.round(50 + Math.random() * 500) / 10,
                    confidence: 0.6 + Math.random() * 0.35,
                    thumbnail: "",
                    pointCount: Math.floor(10000 + Math.random() * 90000),
                  });
                  store.setStage("complete");
                  store.selectResult(id);
                }, 400);
              } else {
                store.setProgress(q);
              }
            }, 300);
          }, 400);
        } else {
          store.setProgress(p);
        }
      }, 200);
    },
    [store]
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      if (stage !== "idle" && stage !== "complete") return;
      const file = files[0];
      if (!file) return;

      if (sidecarAvailable === true) {
        processWithSidecar(file);
      } else {
        simulateProcessing(file.name);
      }
    },
    [stage, sidecarAvailable, processWithSidecar, simulateProcessing]
  );

  return (
    <div className="w-full h-full bg-forge-900 flex">
      {/* Left — Upload & Processing */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-200">AI Scan</h2>
            {sidecarAvailable === true && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700/30">
                rembg attivo
              </span>
            )}
            {sidecarAvailable === false && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                simulazione
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Scansiona foto o modelli 3D per ricostruzione parametrica automatica
          </p>
          {sidecarAvailable === false && sidecarError && (
            <p className="text-[10px] text-yellow-500/70 mt-1">
              Sidecar non disponibile: {sidecarError} (usa simulazione)
            </p>
          )}
        </div>

        {(stage === "idle" || stage === "complete") && (
          <div className="flex-1 min-h-[300px]">
            <UploadZone onFiles={handleFiles} />
          </div>
        )}

        {stage === "uploading" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ProgressBar progress={progress} label={`Caricamento ${currentFile}...`} />
            <p className="text-xs text-gray-500 mt-4">
              {sidecarAvailable ? "Invio al sidecar Python..." : "Invio al server AI..."}
            </p>
          </div>
        )}

        {stage === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <ProgressBar progress={progress} label="Ricostruzione 3D in corso..." />
            <p className="text-xs text-gray-500 mt-4">
              {sidecarAvailable
                ? "rembg · Segmentazione · Feature extraction"
                : "Segmentazione · Feature extraction · Mesh generation"}
            </p>
            <div className="mt-6 w-full max-w-md">
              <WireframePreview />
            </div>
          </div>
        )}

        {stage === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-sm text-red-400 mb-2">Errore durante la scansione</p>
            <p className="text-xs text-gray-500 max-w-sm text-center">{sidecarError}</p>
            <button
              onClick={() => store.reset()}
              className="mt-4 px-4 py-2 rounded text-xs bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors"
            >
              Riprova
            </button>
          </div>
        )}

        {stage === "complete" && selectedResultId && (
          <div className="mt-4 space-y-4">
            <div className="bg-forge-800 rounded-lg border border-forge-700 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Anteprima Ricostruzione
              </h3>
              {(() => {
                const result = results.find((r) => r.id === selectedResultId);
                if (result?.thumbnail) {
                  return (
                    <img
                      src={result.thumbnail}
                      alt="Processed"
                      className="w-full h-48 object-contain bg-forge-900 rounded"
                    />
                  );
                }
                return <WireframePreview />;
              })()}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {results
                  .find((r) => r.id === selectedResultId)
                  ?.estimatedDimensions && (
                  <>
                    <div className="bg-forge-700 rounded p-2 text-center">
                      <p className="text-[10px] text-gray-500">Larghezza</p>
                      <p className="text-sm font-mono text-gray-300">
                        {results.find((r) => r.id === selectedResultId)!
                          .estimatedDimensions.width}{" "}
                        cm
                      </p>
                    </div>
                    <div className="bg-forge-700 rounded p-2 text-center">
                      <p className="text-[10px] text-gray-500">Altezza</p>
                      <p className="text-sm font-mono text-gray-300">
                        {results.find((r) => r.id === selectedResultId)!
                          .estimatedDimensions.height}{" "}
                        cm
                      </p>
                    </div>
                    <div className="bg-forge-700 rounded p-2 text-center">
                      <p className="text-[10px] text-gray-500">Profondità</p>
                      <p className="text-sm font-mono text-gray-300">
                        {results.find((r) => r.id === selectedResultId)!
                          .estimatedDimensions.depth}{" "}
                        cm
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {(() => {
                  const result = results.find((r) => r.id === selectedResultId);
                  if (result?.libraryMatch) {
                    return (
                      <button
                        onClick={handleImportToScene}
                        className="flex-1 py-2 rounded text-xs bg-forge-accent text-forge-900 font-medium hover:bg-forge-accent/90 transition-colors"
                      >
                        Importa: {result.libraryMatch.nameIt}
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={() => store.reset()}
                      className="flex-1 py-2 rounded text-xs bg-forge-accent text-forge-900 font-medium hover:bg-forge-accent/90 transition-colors"
                    >
                      Importa in Scena
                    </button>
                  );
                })()}
                {sidecarAvailable === true && (
                  <>
                    <button
                      onClick={analyseWithSidecar}
                      disabled={analysing}
                      className="px-4 py-2 rounded text-xs bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors disabled:opacity-50"
                    >
                      {analysing ? "Analizzando..." : "Analisi strutturale"}
                    </button>
                    <button
                      onClick={matchWithLibrary}
                      disabled={matching || !results.find((r) => r.id === selectedResultId)?.structuralAnalysis}
                      className="px-4 py-2 rounded text-xs bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors disabled:opacity-50"
                    >
                      {matching ? "Cercando..." : "Trova in Libreria"}
                    </button>
                    <button
                      onClick={vectorizeWithSidecar}
                      disabled={vectorizing}
                      className="px-4 py-2 rounded text-xs bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors disabled:opacity-50"
                    >
                      {vectorizing ? "Vettorizzando..." : "Vettorizza SVG"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => store.reset()}
                  className="px-4 py-2 rounded text-xs bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors"
                >
                  Nuova Scansione
                </button>
              </div>
              {vectorizeError && (
                <p className="text-[10px] text-red-400 mt-2">{vectorizeError}</p>
              )}
              {analysisError && (
                <p className="text-[10px] text-red-400 mt-2">{analysisError}</p>
              )}
              {matchError && (
                <p className="text-[10px] text-red-400 mt-2">{matchError}</p>
              )}
              {(() => {
                const result = results.find((r) => r.id === selectedResultId);
                if (result?.libraryMatch) {
                  const m = result.libraryMatch;
                  return (
                    <div className="mt-4 bg-forge-900 rounded border border-forge-700 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">Match libreria parametrica</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700/30">
                          {Math.round(m.confidence * 100)}% match
                        </span>
                      </div>
                      <div className="bg-forge-800 rounded p-2">
                        <p className="text-xs font-medium text-forge-accent">{m.nameIt}</p>
                        <p className="text-[10px] text-gray-500">{m.category}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {m.paramKeys.map((key) => (
                          <div key={key} className="bg-forge-800 rounded p-2">
                            <p className="text-[10px] text-gray-500 capitalize">{key}</p>
                            <p className="text-xs font-mono text-gray-300">
                              {m.suggestedParams[key] ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (result?.structuralAnalysis) {
                  const a = result.structuralAnalysis;
                  return (
                    <div className="mt-4 bg-forge-900 rounded border border-forge-700 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-500">Analisi strutturale</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          a.source === "claude_vision"
                            ? "bg-purple-900/30 text-purple-400 border-purple-700/30"
                            : "bg-blue-900/30 text-blue-400 border-blue-700/30"
                        }`}>
                          {a.source === "claude_vision" ? "Claude Vision" : "OpenCV"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-forge-800 rounded p-2">
                          <p className="text-[10px] text-gray-500">Tipo struttura</p>
                          <p className="text-xs text-gray-300">{a.tipo_struttura}</p>
                        </div>
                        <div className="bg-forge-800 rounded p-2">
                          <p className="text-[10px] text-gray-500">Pattern</p>
                          <p className="text-xs text-gray-300">{a.pattern_geometrico}</p>
                        </div>
                        <div className="bg-forge-800 rounded p-2">
                          <p className="text-[10px] text-gray-500">Simmetria</p>
                          <p className="text-xs text-gray-300">{a.simmetria}</p>
                        </div>
                        <div className="bg-forge-800 rounded p-2">
                          <p className="text-[10px] text-gray-500">Confidence</p>
                          <p className="text-xs text-gray-300">{Math.round(a.confidence * 100)}%</p>
                        </div>
                      </div>
                      <div className="bg-forge-800 rounded p-2">
                        <p className="text-[10px] text-gray-500 mb-1">Elementi identificati</p>
                        <div className="flex flex-wrap gap-1">
                          {a.elementi_identificati.map((el, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-forge-700 text-gray-300">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>
                      {a.raccomandazioni_fabbricazione.length > 0 && (
                        <div className="bg-forge-800 rounded p-2">
                          <p className="text-[10px] text-gray-500 mb-1">Raccomandazioni</p>
                          <ul className="space-y-0.5">
                            {a.raccomandazioni_fabbricazione.map((rec, i) => (
                              <li key={i} className="text-[10px] text-gray-400 flex items-start gap-1">
                                <span className="text-forge-accent mt-0.5">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }
                if (result?.svgContent) {
                  return (
                    <div className="mt-4 bg-forge-900 rounded border border-forge-700 p-2">
                      <p className="text-[10px] text-gray-500 mb-1">SVG Vectorizzato</p>
                      <div
                        className="w-full h-40"
                        dangerouslySetInnerHTML={{ __html: result.svgContent }}
                      />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Right — Scan History */}
      <div className="w-72 bg-forge-800 border-l border-forge-700 flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-forge-700">
          <span className="text-sm font-medium text-gray-300">Storico Scansioni</span>
        </div>
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {results.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                Nessuna scansione completata
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                Carica un file per iniziare
              </p>
            </div>
          )}
          {results.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              active={result.id === selectedResultId}
              onClick={() => store.selectResult(result.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
