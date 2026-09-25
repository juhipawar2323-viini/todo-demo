/**
 * Standard API Response Utilities
 * Enforces uniform response schema across the entire application:
 * Success: { success: true, message: "...", data: {...} }
 * Error:   { success: false, message: "..." }
 */

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors && process.env.NODE_ENV !== 'production') {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
