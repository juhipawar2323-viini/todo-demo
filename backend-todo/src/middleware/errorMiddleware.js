const { sendError } = require('../utils/response');

/**
 * Centralized Error Handling Middleware
 * Catches all forwarded errors, formats them into a standard JSON response,
 * and ensures internal server details are never leaked.
 */
const errorMiddleware = (err, req, res, next) => {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Determine appropriate HTTP status code
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'An unexpected internal server error occurred';

  // Handle Supabase/PostgreSQL error codes
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        statusCode = 409;
        message = 'A record with this information already exists';
        break;
      case '23503': // Foreign key violation
        statusCode = 400;
        message = 'Invalid reference identifier provided';
        break;
      case '22P02': // Invalid text representation (e.g. invalid UUID format)
        statusCode = 400;
        message = 'Invalid ID or format provided';
        break;
      case 'PGRST116': // Single row expected but 0 or more found
        statusCode = 404;
        message = 'Resource not found';
        break;
      case '42501': // Insufficient privileges / RLS violation
        statusCode = 403;
        message = 'Access denied: Database policy violation';
        break;
      default:
        break;
    }
  }

  // Log server errors for backend debugging (not exposed to user)
  if (statusCode >= 500) {
    console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  } else {
    console.warn(`[CLIENT ERROR ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  return sendError(res, statusCode, message, err.errors || null);
};

module.exports = errorMiddleware;
