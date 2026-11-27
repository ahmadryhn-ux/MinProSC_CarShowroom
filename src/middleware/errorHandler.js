export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (res.headersSent) return;
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must contain valid JSON' });
  }
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ success: false, message: 'Validation failed', details });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid value for ${error.path}` });
  }
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status < 500 ? error.message : 'Internal server error';
  if (status >= 500) console.error(error);
  return res.status(status).json({ success: false, message });
}
