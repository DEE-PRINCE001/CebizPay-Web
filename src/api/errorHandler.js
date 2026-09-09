/**
 * Normalizes API error responses (specifically ASP.NET Core ProblemDetails) into a clean, predictable format.
 *
 * ProblemDetails structure:
 * {
 *   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
 *   "title": "Bad Request",
 *   "status": 400,
 *   "detail": "One or more validation errors occurred.",
 *   "errors": { "Email": ["The Email field is required."] }
 * }
 */
export function normalizeApiError(error) {
  if (!error.response) {
    // Network or client connection error
    return {
      message: error.message || 'Unable to connect to the server. Please check your network connection.',
      status: 0,
      title: 'Network Error',
      detail: error.message,
      errors: {},
      isNetworkError: true,
      isAuthError: false,
      raw: error
    };
  }

  const { status, data } = error.response;
  const isAuthError = status === 401 || status === 403;

  let message = 'An unexpected error occurred.';
  let title = 'Error';
  let detail = null;
  let errors = {};
  let fieldErrors = {};

  if (typeof data === 'string') {
    message = data;
    detail = data;
  } else if (data && typeof data === 'object') {
    title = data.title || (status === 400 ? 'Validation Error' : 'Error');
    detail = data.detail || null;

    // 1. Array of errors: e.g. data.errors = ["Invalid credentials."] or [{ code, description }]
    if (Array.isArray(data.errors)) {
      errors = data.errors;
      if (data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === 'string') {
          message = first;
        } else if (first && typeof first === 'object') {
          message = first.description || first.message || first.detail || JSON.stringify(first);
        }
      }
    } else if (data.errors && typeof data.errors === 'object') {
      // 2. Field-level validation errors (ASP.NET Core standard: { "Email": ["The Email field is required."] })
      errors = data.errors;
      fieldErrors = data.errors;
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey) {
        const val = data.errors[firstKey];
        if (Array.isArray(val) && val.length > 0) {
          message = val[0];
        } else if (typeof val === 'string') {
          message = val;
        }
      }
    } else if (typeof data.errors === 'string') {
      message = data.errors;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else if (data.title) {
      message = data.title;
    } else if (data.error) {
      message = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
    }
  }

  return {
    message,
    status,
    title,
    detail,
    errors,
    fieldErrors,
    isNetworkError: false,
    isAuthError,
    raw: error
  };
}
