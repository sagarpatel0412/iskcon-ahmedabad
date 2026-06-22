import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",

  // Keep low in production to save quota
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Privacy-safe config
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },

  beforeSend(event) {
    // Avoid sending sensitive headers accidentally
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }

    return event;
  },
});