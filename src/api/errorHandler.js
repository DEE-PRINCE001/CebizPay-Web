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

  if (typeof data === 'string') {
    message = data;
    detail = data;
  } else if (data && typeof data === 'object') {
    title = data.title || (status === 400 ? 'Validation Error' : 'Error');
    detail = data.detail || null;

    // Field-level validation errors (ASP.NET Core standard)
    if (data.errors && typeof data.errors === 'object') {
      errors = data.errors;
      // Extract the first error message as primary message if available
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && Array.isArray(data.errors[firstKey]) && data.errors[firstKey].length > 0) {
        message = data.errors[firstKey][0];
      }
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else if (data.title) {
      message = data.title;
    }
  }

  return {
    message,
    status,
    title,
    detail,
    errors,
    isNetworkError: false,
    isAuthError,
    raw: error
  };
}
