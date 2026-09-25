import { request } from './api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} credentials - { name, email, password }
   */
  async register({ name, email, password }) {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  /**
   * Authenticate user with credentials
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    return await request('/auth/me', {
      method: 'GET'
    });
  }
};
