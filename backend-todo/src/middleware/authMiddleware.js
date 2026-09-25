const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

/**
 * JWT Authentication Middleware
 * Validates the Authorization Bearer header, decodes the JWT,
 * and attaches user data (id, email) to req.user.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 401, 'Authorization header is missing. Access denied.');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return sendError(res, 401, 'Invalid Authorization header format. Format must be: Bearer <token>');
    }

    const token = parts[1];

    if (!token || token.trim() === '') {
      return sendError(res, 401, 'Authentication token is missing.');
    }

    // Verify token with JWT_SECRET
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return sendError(res, 401, 'Invalid token payload.');
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token has expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid authentication token. Verification failed.');
    }
    return sendError(res, 401, 'Authentication failed.');
  }
};

module.exports = authMiddleware;
