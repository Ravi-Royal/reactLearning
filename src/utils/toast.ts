import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toastStore: {
  toasts: Toast[];
  listeners: Array<(toasts: Toast[]) => void>;
} = {
  toasts: [],
  listeners: [],
};

const notify = (toasts: Toast[]): void => {
  toastStore.listeners.forEach((listener) => listener(toasts));
};

/**
 * Add a toast notification
 */
export const toast = {
  success: (message: string, duration = 3000): void => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type: 'success',
      duration,
    };
    toastStore.toasts = [...toastStore.toasts, newToast];
    notify(toastStore.toasts);

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(newToast.id);
      }, duration);
    }
  },

  error: (message: string, duration = 4000): void => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type: 'error',
      duration,
    };
    toastStore.toasts = [...toastStore.toasts, newToast];
    notify(toastStore.toasts);

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(newToast.id);
      }, duration);
    }
  },

  info: (message: string, duration = 3000): void => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type: 'info',
      duration,
    };
    toastStore.toasts = [...toastStore.toasts, newToast];
    notify(toastStore.toasts);

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(newToast.id);
      }, duration);
    }
  },

  warning: (message: string, duration = 3000): void => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type: 'warning',
      duration,
    };
    toastStore.toasts = [...toastStore.toasts, newToast];
    notify(toastStore.toasts);

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(newToast.id);
      }, duration);
    }
  },

  dismiss: (id: string): void => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
    notify(toastStore.toasts);
  },
};

/**
 * Hook to use toast notifications in components
 */
export const useToast = (): Toast[] => {
  const [toasts, setToasts] = useState<Toast[]>(toastStore.toasts);

  useEffect(() => {
    const listener = (updatedToasts: Toast[]) => {
      setToasts(updatedToasts);
    };

    toastStore.listeners.push(listener);

    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  }, []);

  return toasts;
};
