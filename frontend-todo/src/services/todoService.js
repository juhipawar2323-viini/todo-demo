import { request } from './api';

export const todoService = {
  /**
   * Fetch all todos belonging to authenticated user
   */
  async getAll() {
    const res = await request('/todos', { method: 'GET' });
    return res.data?.todos || [];
  },

  /**
   * Fetch single todo by ID
   * @param {string} id
   */
  async getById(id) {
    const res = await request(`/todos/${id}`, { method: 'GET' });
    return res.data?.todo;
  },

  /**
   * Create a new todo
   * @param {Object} data - { title, description }
   */
  async create(data) {
    const res = await request('/todos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data?.todo;
  },

  /**
   * Update existing todo
   * @param {string} id
   * @param {Object} updates - { title, description, completed }
   */
  async update(id, updates) {
    const res = await request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.data?.todo;
  },

  /**
   * Delete todo by ID
   * @param {string} id
   */
  async delete(id) {
    return await request(`/todos/${id}`, {
      method: 'DELETE'
    });
  }
};
