import axios from 'axios';

/**
 * Mirrors the backend AppError envelope. The mobile error UI dispatches on
 * `code` for known cases and falls back to a generic message otherwise.
 */
export class ClientError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ClientError';
  }
}

interface BackendErrorBody {
  message?: string | string[];
  error?: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string>;
}

export const mapAxiosError = (err: unknown): ClientError => {
  if (axios.isAxiosError(err)) {
    // No response → network/timeout failure.
    if (!err.response) {
      const isTimeout = err.code === 'ECONNABORTED';
      const baseMessage = isTimeout
        ? 'The request timed out. Please try again.'
        : 'Could not reach the server. Check your connection.';
      const detail =
        __DEV__ && err.code ? ` (${err.code})` : '';
      return new ClientError(
        baseMessage + detail,
        0,
        isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      );
    }

    const status = err.response.status;
    const body = (err.response.data ?? {}) as BackendErrorBody;

    const message = Array.isArray(body.message)
      ? body.message.join('\n')
      : body.message || body.error || defaultMessageFor(status);

    const code = body.code || codeFor(status);

    return new ClientError(message, body.statusCode ?? status, code, body.errors);
  }

  if (err instanceof Error) {
    return new ClientError(err.message, 0, 'UNKNOWN');
  }

  return new ClientError('Something went wrong.', 0, 'UNKNOWN');
};

const codeFor = (status: number): string => {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'VALIDATION_ERROR';
    default:
      return status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN';
  }
};

const defaultMessageFor = (status: number): string => {
  switch (status) {
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That action conflicts with the current state.';
    default:
      return status >= 500
        ? 'The server ran into a problem. Please try again later.'
        : 'Something went wrong.';
  }
};
