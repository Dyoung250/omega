import { useState, useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import { LogIn, UserPlus, ArrowLeft, Loader2 } from "lucide-react";

export default function AuthModal() {
  const store = useAuthStore();
  const { showAuthModal, authView, authError, loading, setShowAuthModal, setAuthView, signIn, signUp, clearAuthError } = store;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const reset = useCallback(() => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    clearAuthError();
  }, [clearAuthError]);

  const handleClose = useCallback(() => {
    setShowAuthModal(false);
    reset();
  }, [setShowAuthModal, reset]);

  const switchView = useCallback(
    (view: "login" | "register" | "forgot") => {
      setAuthView(view);
      reset();
    },
    [setAuthView, reset]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (authView === "login") {
        await signIn(email, password);
      } else if (authView === "register") {
        await signUp(email, password, displayName);
      }
    },
    [authView, email, password, displayName, signIn, signUp]
  );

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-800 border border-forge-700 rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {authView !== "login" && (
              <button
                onClick={() => switchView("login")}
                className="p-1 rounded hover:bg-forge-700 text-gray-400 transition-colors"
                title="Indietro"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 className="text-sm font-semibold text-gray-200">
              {authView === "login" && "Accedi"}
              {authView === "register" && "Registrati"}
              {authView === "forgot" && "Recupera password"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-300 text-lg leading-none"
            title="Chiudi"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authView === "register" && (
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Nome visualizzato
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full bg-forge-900 border border-forge-600 rounded px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-forge-accent transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-forge-900 border border-forge-600 rounded px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-forge-accent transition-colors"
            />
          </div>

          {authView !== "forgot" && (
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-forge-900 border border-forge-600 rounded px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-forge-accent transition-colors"
              />
            </div>
          )}

          {authError && (
            <p className="text-[10px] text-red-400 bg-red-900/20 border border-red-700/30 rounded p-2">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded text-xs font-medium bg-forge-accent text-forge-900 hover:bg-forge-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Attendere...
              </>
            ) : authView === "login" ? (
              <>
                <LogIn size={14} />
                Accedi
              </>
            ) : authView === "register" ? (
              <>
                <UserPlus size={14} />
                Crea account
              </>
            ) : (
              "Invia link"
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
          {authView === "login" && (
            <>
              <button
                onClick={() => switchView("register")}
                className="text-forge-accent hover:underline"
              >
                Crea account
              </button>
              <span>·</span>
              <button
                onClick={() => switchView("forgot")}
                className="text-gray-400 hover:text-gray-300"
              >
                Password dimenticata?
              </button>
            </>
          )}
          {authView === "register" && (
            <button
              onClick={() => switchView("login")}
              className="text-forge-accent hover:underline"
            >
              Hai già un account? Accedi
            </button>
          )}
          {authView === "forgot" && (
            <button
              onClick={() => switchView("login")}
              className="text-forge-accent hover:underline"
            >
              Torna al login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
