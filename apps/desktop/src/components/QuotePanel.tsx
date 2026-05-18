import { useMemo } from "react";
import { useQuoteStore } from "../stores/quoteStore";
import { useObjectStore } from "../stores/objectStore";
import { calculateQuote, calculateSceneWeight } from "../utils/quoteEngine";
import { Calculator, X, Weight, Package, Paintbrush, Wrench, Truck, Percent, Euro, FileDown } from "lucide-react";
import { downloadQuotePDF } from "../utils/pdfQuote";

export default function QuotePanel() {
  const objects = useObjectStore((s) => s.objects);
  const show = useQuoteStore((s) => s.showQuotePanel);
  const setShow = useQuoteStore((s) => s.setShowQuotePanel);
  const rates = useQuoteStore((s) => s.rates);
  const updateRates = useQuoteStore((s) => s.updateRates);

  const quote = useMemo(() => calculateQuote(objects, rates), [objects, rates]);
  const sceneWeight = useMemo(() => calculateSceneWeight(objects), [objects]);

  if (!show) return null;

  return (
    <div className="absolute right-0 top-10 bottom-0 w-80 bg-forge-800 border-l border-forge-600 z-40 flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-forge-600">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-forge-accent" />
          <span className="text-sm font-semibold text-gray-200">Preventivo</span>
        </div>
        <div className="flex items-center gap-2">
          {quote.items.length > 0 && (
            <button
              onClick={() => downloadQuotePDF(quote)}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-forge-accent/20 text-forge-accent hover:bg-forge-accent/30 transition-colors"
              title="Scarica PDF"
            >
              <FileDown className="w-3 h-3" />
              PDF
            </button>
          )}
          <button
            onClick={() => setShow(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Chiudi preventivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Scene summary */}
        <div className="flex items-center gap-3 bg-forge-700 rounded p-3">
          <Weight className="w-4 h-4 text-forge-accent" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase">Peso totale scena</div>
            <div className="text-sm font-mono text-gray-200">{sceneWeight} kg</div>
          </div>
        </div>

        {/* Items list */}
        {quote.items.length === 0 ? (
          <div className="text-center text-xs text-gray-500 py-8">Nessun elemento in scena</div>
        ) : (
          <div className="space-y-2">
            <div className="text-[10px] text-forge-accent uppercase tracking-wider font-semibold">Elementi</div>
            {quote.items.map((item) => (
              <div key={item.id} className="bg-forge-700 rounded p-2.5 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium truncate">{item.name}</span>
                  <span className="text-gray-400 font-mono">{item.weightKg} kg</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{item.materialName}</span>
                  <span className="font-mono text-gray-400">€{item.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rates editor */}
        <div className="space-y-2">
          <div className="text-[10px] text-forge-accent uppercase tracking-wider font-semibold">Tariffe</div>
          <div className="grid grid-cols-2 gap-2">
            <RateField label="Verniciatura %" value={rates.paintPercent} onChange={(v) => updateRates({ paintPercent: v })} icon={<Paintbrush className="w-3 h-3" />} />
            <RateField label="Montaggio €/elem" value={rates.assemblyPerItem} onChange={(v) => updateRates({ assemblyPerItem: v })} icon={<Wrench className="w-3 h-3" />} />
            <RateField label="Montaggio €/kg" value={rates.assemblyPerKg} onChange={(v) => updateRates({ assemblyPerKg: v })} icon={<Weight className="w-3 h-3" />} />
            <RateField label="Trasporto fisso €" value={rates.transportBase} onChange={(v) => updateRates({ transportBase: v })} icon={<Truck className="w-3 h-3" />} />
            <RateField label="Trasporto €/kg" value={rates.transportPerKg} onChange={(v) => updateRates({ transportPerKg: v })} icon={<Truck className="w-3 h-3" />} />
            <RateField label="Margine %" value={rates.marginPercent} onChange={(v) => updateRates({ marginPercent: v })} icon={<Percent className="w-3 h-3" />} />
          </div>
        </div>

        {/* Totals */}
        {quote.items.length > 0 && (
          <div className="bg-forge-700 rounded p-3 space-y-1.5 text-xs">
            <TotalRow icon={<Package className="w-3 h-3" />} label="Materiale" value={quote.subtotalMaterial} />
            <TotalRow icon={<Paintbrush className="w-3 h-3" />} label="Verniciatura" value={quote.subtotalPaint} />
            <TotalRow icon={<Wrench className="w-3 h-3" />} label="Montaggio" value={quote.subtotalAssembly} />
            <TotalRow icon={<Truck className="w-3 h-3" />} label="Trasporto" value={quote.transportCost} />
            <div className="h-px bg-forge-600 my-1" />
            <TotalRow label="Subtotale" value={quote.subtotal} bold />
            <TotalRow icon={<Percent className="w-3 h-3" />} label={`Margine (${(quote.marginPercent * 100).toFixed(0)}%)`} value={quote.marginAmount} />
            <div className="h-px bg-forge-600 my-1" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-forge-accent font-semibold flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5" /> Totale
              </span>
              <span className="text-base font-mono font-bold text-forge-accent">€{quote.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RateField({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-forge-700 rounded p-2">
      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <input
        type="number"
        aria-label={label}
        value={value}
        step={0.01}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full text-xs font-mono text-gray-300 bg-forge-800 px-2 py-1 rounded border border-forge-500/30 focus:border-forge-accent outline-none"
      />
    </div>
  );
}

function TotalRow({
  icon,
  label,
  value,
  bold,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-semibold text-gray-200" : "text-gray-400"}`}>
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-mono">€{value.toFixed(2)}</span>
    </div>
  );
}
