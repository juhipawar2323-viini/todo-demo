const TodoModel = require('../models/todoModel');

class TodoService {
  /**
   * Create a new todo
   * @param {string} userId - Authenticated user UUID
   * @param {Object} data - { title, description }
   * @returns {Promise<Object>}
   */
  static async createTodo(userId, data) {
    const { title, description } = data;

    if (!title || typeof title !== 'string' || !title.trim()) {
      const error = new Error('Title is required');
      error.statusCode = 400;
      throw error;
    }

    return await TodoModel.create({
      userId,
      title: title.trim(),
      description: description ? description.trim() : null
    });
  }

  /**
   * Get all todos for user
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Array>}
   */
  static async getTodos(userId) {
    return await TodoModel.findByUserId(userId);
  }

  /**
   * Get single todo by ID ensuring user ownership
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Object>}
   */
  static async getTodoById(id, userId) {
    const todo = await TodoModel.findByIdAndUserId(id, userId);
    if (!todo) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  }

  /**
   * Update todo owned by user
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @param {Object} updates - { title, description, completed }
   * @returns {Promise<Object>}
   */
  static async updateTodo(id, userId, updates) {
    // 1. Verify existence and ownership
    const existing = await TodoModel.findByIdAndUserId(id, userId);
    if (!existing) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }

    const sanitizedUpdates = {};

    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || !updates.title.trim()) {
        const error = new Error('Title cannot be empty');
        error.statusCode = 400;
        throw error;
      }
      sanitizedUpdates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      sanitizedUpdates.description = updates.description ? updates.description.trim() : null;
    }

    if (updates.completed !== undefined) {
      if (typeof updates.completed !== 'boolean') {
        const error = new Error('Completed must be a boolean (true or false)');
        error.statusCode = 400;
        throw error;
      }
      sanitizedUpdates.completed = updates.completed;
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      const error = new Error('At least one field (title, description, completed) must be provided for update');
      error.statusCode = 400;
      throw error;
    }

    return await TodoModel.update(id, userId, sanitizedUpdates);
  }

  /**
   * Delete todo owned by user
   * @param {string} id - Todo UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<void>}
   */
  static async deleteTodo(id, userId) {
    const existing = await TodoModel.findByIdAndUserId(id, userId);
    if (!existing) {
      const error = new Error('Todo not found');
      error.statusCode = 404;
      throw error;
    }

    await TodoModel.delete(id, userId);
  }
}

module.exports = TodoService;
