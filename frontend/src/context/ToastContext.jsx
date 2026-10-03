
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  error: {
    bg: "bg-red-600",
    icon: AlertCircle,
    title: "Error",
  },
  success: {
    bg: "bg-green-600",
    icon: CheckCircle,
    title: "Success",
  },
  warning: {
    bg: "bg-amber-500",
    icon: AlertTriangle,
    title: "Warning",
  },
  info: {
    bg: "bg-blue-600",
    icon: Info,
    title: "Info",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "error", duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = {
        id,
        message,
        type: toastStyles[type] ? type : "info",
      };

      setToasts((current) => [...current, toast]);

      if (duration > 0) {
        timers.current[id] = setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      <div className="pointer-events-none fixed bottom-2 left-2 z-[9999] flex w-[calc(100%-16px)] max-w-[480px] flex-col gap-3 sm:bottom-4 sm:left-2 sm:w-[480px]">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex min-h-[100px] items-center gap-4 rounded-xl ${style.bg} px-6 py-5 text-white shadow-2xl animate-[toastIn_0.3s_ease-out]`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/15">
                <Icon size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-base font-bold">{style.title}</p>
                <p className="mt-1 break-words text-sm leading-5">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded p-1 text-white/90 transition hover:bg-white/15 hover:text-white"
                aria-label="Close notification"
              >
                <X size={21} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(-25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}