import * as Sentry from '@sentry/nextjs';

class LoggerService {
  public captureException(exception: Error) {
    Sentry.captureException(exception);
  }
}

export default new LoggerService();
