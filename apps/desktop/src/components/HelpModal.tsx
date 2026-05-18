interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

export default function HelpModal({ show, onClose }: HelpModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-800 border border-forge-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200">Scorciatoie da Tastiera</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            title="Chiudi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {[
            { keys: ["1", "2", "3"], desc: "Passa a vista 3D / dall'alto / AI Scan" },
            { keys: ["Tab"], desc: "Cicla tra gli oggetti della scena" },
            { keys: ["Del"], desc: "Elimina l'oggetto selezionato" },
            { keys: ["Ctrl", "S"], desc: "Screenshot della scena" },
            { keys: ["Ctrl", "G"], desc: "Esporta in GLB" },
            { keys: ["G"], desc: "Attiva/disattiva griglia snap" },
            { keys: ["M"], desc: "Attiva/disattiva simmetria" },
          ].map((item) => (
            <div key={item.desc} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{item.desc}</span>
              <div className="flex gap-1">
                {item.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-1.5 py-0.5 rounded bg-forge-700 border border-forge-500/50 text-[10px] text-gray-300 font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-forge-700">
          <p className="text-[10px] text-gray-500 text-center">
            Global Consulting S.R.L.S. · FORGIA Ω v0.1.0
          </p>
        </div>
      </div>
    </div>
  );
}
