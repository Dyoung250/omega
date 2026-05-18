import { useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function UpdateChecker() {
  const [checking, setChecking] = useState(false);
  const [update, setUpdate] = useState<Awaited<ReturnType<typeof check>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleCheck() {
    setChecking(true);
    setError(null);
    setUpdate(null);
    try {
      const result = await check();
      setUpdate(result);
    } catch (e: any) {
      setError(e?.message ?? "Update check failed");
    } finally {
      setChecking(false);
    }
  }

  async function handleInstall() {
    if (!update) return;
    setDownloading(true);
    try {
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            console.log(`Download started: ${event.data.contentLength} bytes`);
            break;
          case "Progress":
            console.log(`Downloaded ${event.data.chunkLength}`);
            break;
          case "Finished":
            console.log("Download finished");
            break;
        }
      });
    } catch (e: any) {
      setError(e?.message ?? "Install failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheck}
        disabled={checking}
        className="w-full flex items-center justify-center gap-2 py-2 rounded bg-forge-700 text-gray-300 hover:bg-forge-600 transition-colors disabled:opacity-50 text-xs"
      >
        {checking ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5" />
        )}
        {checking ? "Verifica..." : "Controlla aggiornamenti"}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-900/20 rounded p-2">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {update && (
        <div className="bg-forge-700 rounded p-3 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="font-medium">Aggiornamento disponibile</span>
          </div>
          <div className="text-gray-300">
            Versione: <span className="font-mono font-medium">{update.version}</span>
          </div>
          {update.body && (
            <div className="text-gray-400 max-h-20 overflow-y-auto scrollbar-thin">
              {update.body}
            </div>
          )}
          <button
            onClick={handleInstall}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded bg-forge-accent text-forge-900 font-semibold hover:bg-[#dcc060] transition-colors disabled:opacity-50 text-xs"
          >
            {downloading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {downloading ? "Download..." : "Installa aggiornamento"}
          </button>
        </div>
      )}

      {update === null && !checking && !error && (
        <div className="text-center text-[10px] text-gray-500">
          FORGIA v{import.meta.env.VITE_APP_VERSION ?? "0.1.0"}
        </div>
      )}
    </div>
  );
}
