import { useToastStore } from "../stores/toastStore";

const typeStyles = {
  info: "bg-forge-700 border-forge-500/50 text-gray-200",
  success: "bg-green-900/40 border-green-700/50 text-green-300",
  warning: "bg-yellow-900/40 border-yellow-700/50 text-yellow-300",
  error: "bg-red-900/40 border-red-700/50 text-red-300",
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-lg border shadow-lg text-xs animate-slide-up backdrop-blur-sm ${typeStyles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
