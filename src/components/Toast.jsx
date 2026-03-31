import React from "react";
import { useToast } from "../context/ToastContext";
import { X } from "lucide-react";

const PRIMARY = "#68911a";

export default function Toast() {
  const { toasts, setToasts } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const removeToast = (id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  return (
    <div className="fixed right-4 top-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";

        return (
          <div
            key={t.id}
            className={`relative overflow-hidden px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 min-w-[250px]
            animate-slide-in
            ${
              isSuccess
                ? "bg-white text-gray-800 border border-gray-200"
                : t.type === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {/* Message */}
            <span className="text-sm font-medium">{t.message}</span>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              className={`${
                isSuccess
                  ? "text-gray-500 hover:text-gray-800"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <X size={16} />
            </button>

            {/* Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-1 animate-progress"
              style={{
                width: "100%",
                background: isSuccess ? PRIMARY : "rgba(255,255,255,0.7)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}