// Simple logging utility.
// In production, replace console calls with Sentry or similar.

type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...(meta ? { meta } : {}) };

  switch (level) {
    case 'info':
      console.log(JSON.stringify(entry));
      break;
    case 'warn':
      console.warn(JSON.stringify(entry));
      break;
    case 'error':
      console.error(JSON.stringify(entry));
      // Sentry placeholder:
      // if (typeof Sentry !== 'undefined') Sentry.captureException(meta);
      break;
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
};
