import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      beforeSend(event) {
        // Filter out sensitive data
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }

        // Don't send events in test environment
        if (process.env.NODE_ENV === 'test') {
          return null;
        }

        return event;
      },

      // Initial scope will be set in the app
      initialScope: {
        tags: {
          component: 'server',
          environment: process.env.NODE_ENV,
        },
      },

      // Configure for server environment
      environment: process.env.NODE_ENV,

      // Add server-specific context
      beforeSendTransaction(event) {
        // Add server-specific metadata
        event.contexts = {
          ...event.contexts,
          runtime: {
            name: 'node',
            version: process.version,
          },
          server: {
            name: 'brenda-librave-server',
          },
        };

        return event;
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      environment: process.env.NODE_ENV,
      initialScope: {
        tags: {
          component: 'edge',
          environment: process.env.NODE_ENV,
        },
      },
    });
  }
}
