import { useToast, toast as toastAPI, type Toast } from '@utils/toast';
import {
  TOAST_TYPES,
  TOAST_STYLES,
  TOAST_ICONS,
  TOAST_ARIA_LABELS,
  TOAST_BASE_STYLES,
} from './constants/toast.constants';

/**
 * Toast Container Component
 * Displays toast notifications in a fixed position
 */
export function ToastContainer(): React.ReactElement {
  const toasts = useToast();

  const getToastStyles = (type: Toast['type']): string => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `${TOAST_BASE_STYLES} ${TOAST_STYLES.SUCCESS}`;
      case TOAST_TYPES.ERROR:
        return `${TOAST_BASE_STYLES} ${TOAST_STYLES.ERROR}`;
      case TOAST_TYPES.WARNING:
        return `${TOAST_BASE_STYLES} ${TOAST_STYLES.WARNING}`;
      case TOAST_TYPES.INFO:
        return `${TOAST_BASE_STYLES} ${TOAST_STYLES.INFO}`;
      default:
        return `${TOAST_BASE_STYLES} ${TOAST_STYLES.DEFAULT}`;
    }
  };

  const getIcon = (type: Toast['type']): string => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return TOAST_ICONS.SUCCESS;
      case TOAST_TYPES.ERROR:
        return TOAST_ICONS.ERROR;
      case TOAST_TYPES.WARNING:
        return TOAST_ICONS.WARNING;
      case TOAST_TYPES.INFO:
        return TOAST_ICONS.INFO;
      default:
        return TOAST_ICONS.DEFAULT;
    }
  };

  if (toasts.length === 0) {
    return <></>;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          <span className="text-xl font-bold">{getIcon(toast.type)}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => toastAPI.dismiss(toast.id)}
            className="text-white hover:text-gray-200 transition-colors font-bold text-lg"
            aria-label={TOAST_ARIA_LABELS.CLOSE}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
