const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

class AuthService {
  /**
   * Register a new user
   * @param {Object} param0 - { name, email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  static async register({ name, email, password }) {
    // 1. Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      const error = new Error('Name is required');
      error.statusCode = 400;
      throw error;
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const error = new Error('Please provide a valid email address');
      error.statusCode = 400;
      throw error;
    }

    if (!password || typeof password !== 'string') {
      const error = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user already exists
    const existingUser = await UserModel.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // 3. Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Store user in database
    const newUser = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    // 5. Generate authentication token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      },
      token
    };
  }

  /**
   * Authenticate user with email and password
   * @param {Object} param0 - { email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  static async login({ email, password }) {
    // 1. Validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    if (!password || typeof password !== 'string') {
      const error = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user by email
    const user = await UserModel.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // 3. Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // 4. Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token
    };
  }

  /**
   * Get current authenticated user details
   * @param {string} userId - User UUID
   * @returns {Promise<Object>}
   */
  static async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };
  }
}

module.exports = AuthService;
