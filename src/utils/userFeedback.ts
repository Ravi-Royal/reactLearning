/**
 * User Feedback Utilities
 * Provides consistent feedback for user actions
 */

import { toast } from '@utils/toast';

export const feedback = {
  // Success messages
  success: {
    saved: () => toast.success('Saved successfully!'),
    copied: () => toast.success('Copied to clipboard!'),
    reset: () => toast.success('Form reset successfully!'),
    calculated: () => toast.success('Calculation complete!'),
    exported: () => toast.success('Data exported successfully!'),
  },

  // Error messages
  error: {
    general: (message?: string) => toast.error(message || 'Something went wrong. Please try again.'),
    network: () => toast.error('Network error. Please check your connection.'),
    validation: (message: string) => toast.error(message),
    notFound: () => toast.error('Data not found.'),
  },

  // Loading messages
  loading: {
    fetching: () => toast.info('Fetching data...'),
    processing: () => toast.info('Processing...'),
    saving: () => toast.info('Saving...'),
  },

  // Info messages
  info: {
    noData: () => toast.info('No data available.'),
    copied: () => toast.info('Copied!'),
    working: () => toast.info('Working on it...'),
  },
};

// Debounce helper for preventing rapid consecutive calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll helper
export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Copy to clipboard with feedback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    feedback.success.copied();
    return true;
  } catch {
    feedback.error.general('Failed to copy to clipboard');
    return false;
  }
}

// Download helper
export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    feedback.success.exported();
  } catch {
    feedback.error.general('Failed to download file');
  }
}
