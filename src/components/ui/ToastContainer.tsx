import React from 'react';
import { useDealership } from '../../context/DealershipContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDealership();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#16181B]/95 border-[#0E7A33]/50 text-[#F5F2EB]'
              : toast.type === 'error'
              ? 'bg-[#16181B]/95 border-[#B3261E]/50 text-[#F5F2EB]'
              : 'bg-[#16181B]/95 border-[#C6A15B]/50 text-[#F5F2EB]'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#0E7A33]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#B3261E]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#C6A15B]" />}
          </div>
          <div className="flex-1 text-sm font-medium leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-[#9AA0A8] hover:text-[#F5F2EB] p-0.5 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
