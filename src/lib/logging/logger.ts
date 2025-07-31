import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'brenda-librave',
      environment: process.env.NODE_ENV,
    }),
  },
  
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  
  // Simple console output in development to avoid worker thread issues
  ...(isDevelopment && {
    level: 'info',
  }),
  
  // Structured logging in production
  ...(isProduction && {
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers['user-agent'],
          'accept-language': req.headers['accept-language'],
        },
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
      err: pino.stdSerializers.err,
    },
  }),
});

// Helper functions for common logging patterns
export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  logger.info(meta, message);
};

export const logError = (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
  const errorMeta = {
    ...meta,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error,
  };
  logger.error(errorMeta, message);
};

export const logWarning = (message: string, meta?: Record<string, unknown>) => {
  logger.warn(meta, message);
};

export const logDebug = (message: string, meta?: Record<string, unknown>) => {
  logger.debug(meta, message);
};

// Performance logging
export const logPerformance = (operation: string, duration: number, meta?: Record<string, unknown>) => {
  logger.info({
    ...meta,
    operation,
    duration,
    type: 'performance',
  }, `Operation ${operation} completed in ${duration}ms`);
};

// Security logging
export const logSecurity = (event: string, meta?: Record<string, unknown>) => {
  logger.warn({
    ...meta,
    event,
    type: 'security',
    timestamp: new Date().toISOString(),
  }, `Security event: ${event}`);
}; 