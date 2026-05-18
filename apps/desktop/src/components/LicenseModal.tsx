import { useEffect } from "react";
import { useLicenseStore } from "../stores/licenseStore";
import { X, CreditCard, CheckCircle, AlertTriangle, Clock, Zap } from "lucide-react";
import UpdateChecker from "./UpdateChecker";

export default function LicenseModal() {
  const {
    showLicenseModal,
    setShowLicenseModal,
    isLicensed,
    isTrial,
    isExpired,
    trialDaysLeft,
    license,
    openStripeCheckout,
    loading,
  } = useLicenseStore();

  useEffect(() => {
    if (!showLicenseModal) return;
    useLicenseStore.getState().checkLicense();
  }, [showLicenseModal]);

  if (!showLicenseModal) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-800 border border-forge-600 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-600 bg-forge-700/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-forge-accent" />
            <span className="text-base font-semibold text-gray-200">Licenza FORGIA</span>
          </div>
          <button
            onClick={() => setShowLicenseModal(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-6">Caricamento...</div>
          ) : isLicensed ? (
            <ActiveState license={license} />
          ) : isTrial ? (
            <TrialState days={trialDaysLeft} onUpgrade={openStripeCheckout} />
          ) : isExpired ? (
            <ExpiredState onUpgrade={openStripeCheckout} />
          ) : (
            <TrialState days={trialDaysLeft} onUpgrade={openStripeCheckout} />
          )}

          <div className="h-px bg-forge-600" />

          <div>
            <p className="text-[10px] text-forge-accent uppercase tracking-wider mb-2 font-semibold">
              Aggiornamenti
            </p>
            <UpdateChecker />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveState({ license }: { license: ReturnType<typeof useLicenseStore.getState>["license"] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">Licenza attiva</span>
      </div>
      <div className="bg-forge-700 rounded p-3 text-xs space-y-1.5 text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-400">Piano</span>
          <span className="font-medium uppercase">{license?.plan ?? "pro"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Stato</span>
          <span className="font-medium text-green-400">{license?.status}</span>
        </div>
        {license?.current_period_end && (
          <div className="flex justify-between">
            <span className="text-gray-400">Rinnovo</span>
            <span className="font-medium">{new Date(license.current_period_end).toLocaleDateString("it-IT")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TrialState({ days, onUpgrade }: { days: number; onUpgrade: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-forge-accent">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">Prova gratuita in corso</span>
      </div>
      <p className="text-sm text-gray-300">
        Hai <span className="font-bold text-forge-accent">{days} giorni</span> rimanenti nella prova gratuita.
        Passa a Pro per sbloccare tutte le funzionalità.
      </p>
      <div className="bg-forge-700 rounded p-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Esporta illimitati
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Cloud preview
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" /> PDF preventivi
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Supporto prioritario
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-forge-accent text-forge-900 font-semibold text-sm hover:bg-[#dcc060] transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        Passa a Pro
      </button>
    </div>
  );
}

function ExpiredState({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">Licenza scaduta</span>
      </div>
      <p className="text-sm text-gray-300">
        La tua prova gratuita è terminata. Aggiorna a Pro per continuare a usare FORGIA senza limiti.
      </p>
      <button
        onClick={onUpgrade}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-forge-accent text-forge-900 font-semibold text-sm hover:bg-[#dcc060] transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        Sottoscrivi Pro
      </button>
    </div>
  );
}
