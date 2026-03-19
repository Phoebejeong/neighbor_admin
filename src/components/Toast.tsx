import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { CircleCheck, TriangleAlert, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed top-[25vh] left-1/2 -translate-x-1/2 z-[100] space-y-2">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  success: {
    bg: 'bg-white',
    border: 'border-emerald-400',
    icon: 'text-emerald-500',
    text: 'text-stone-800',
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-400',
    icon: 'text-red-500',
    text: 'text-stone-800',
  },
  info: {
    bg: 'bg-white',
    border: 'border-[#7f2929]',
    icon: 'text-[#7f2929]',
    text: 'text-stone-800',
  },
};

const icons = {
  success: <CircleCheck className="w-5 h-5" />,
  error: <TriangleAlert className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const ToastItem: React.FC<{ toast: ToastItem; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const s = styles[toast.type];

  return (
    <div className={`${s.bg} border ${s.border} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] animate-slide-up`}>
      <span className={s.icon}>{icons[toast.type]}</span>
      <span className={`text-sm font-medium flex-1 ${s.text}`}>{toast.message}</span>
    </div>
  );
};
