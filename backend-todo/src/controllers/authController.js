const AuthService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      return sendSuccess(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user and issue JWT
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      return sendSuccess(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Return authenticated user profile
   */
  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return sendSuccess(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
