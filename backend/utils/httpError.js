export function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function notFound(message = "Route not found") {
  return httpError(404, message);
}
