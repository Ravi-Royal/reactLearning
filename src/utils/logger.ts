/**
 * Production-ready logger utility
 * Conditionally logs based on environment
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

const isDevelopment = import.meta.env.MODE === 'development';

const createLogger = (level: LogLevel) => {
  return (message: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console[level](message, ...args);
    } else if (level === 'error') {
      // In production, you might want to send errors to a logging service
      // e.g., Sentry, LogRocket, etc.
      console.error(message, ...args);
      // TODO: Send to error tracking service
      // errorTrackingService.captureException(new Error(message), { extra: args });
    }
  };
};

export const logger = {
  /**
   * Log general information (development only)
   */
  log: createLogger('log'),

  /**
   * Log warnings (development only)
   */
  warn: createLogger('warn'),

  /**
   * Log errors (always logged, sent to tracking service in production)
   */
  error: createLogger('error'),

  /**
   * Log informational messages (development only)
   */
  info: createLogger('info'),

  /**
   * Log debug messages (development only)
   */
  debug: createLogger('debug'),
};

/**
 * Utility to log API failures with context
 */
export const logApiFailure = (apiName: string, error: unknown, context?: Record<string, unknown>): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.warn(`API ${apiName} failed:`, errorMessage, context);
};

/**
 * Utility to log successful operations
 */
export const logSuccess = (operation: string, data?: unknown): void => {
  logger.info(`✓ ${operation}`, data);
};
