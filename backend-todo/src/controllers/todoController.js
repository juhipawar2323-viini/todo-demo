const TodoService = require('../services/todoService');
const { sendSuccess } = require('../utils/response');

class TodoController {
  /**
   * POST /api/todos
   * Create a new todo for the authenticated user
   */
  static async createTodo(req, res, next) {
    try {
      const todo = await TodoService.createTodo(req.user.id, req.body);
      return sendSuccess(res, 201, 'Todo created successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/todos
   * Get all todos for the authenticated user
   */
  static async getTodos(req, res, next) {
    try {
      const todos = await TodoService.getTodos(req.user.id);
      return sendSuccess(res, 200, 'Todos retrieved successfully', { todos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/todos/:id
   * Get a single todo by ID for authenticated user
   */
  static async getTodoById(req, res, next) {
    try {
      const todo = await TodoService.getTodoById(req.params.id, req.user.id);
      return sendSuccess(res, 200, 'Todo retrieved successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/todos/:id
   * Update a todo owned by the authenticated user
   */
  static async updateTodo(req, res, next) {
    try {
      const todo = await TodoService.updateTodo(req.params.id, req.user.id, req.body);
      return sendSuccess(res, 200, 'Todo updated successfully', { todo });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/todos/:id
   * Delete a todo owned by the authenticated user
   */
  static async deleteTodo(req, res, next) {
    try {
      await TodoService.deleteTodo(req.params.id, req.user.id);
      return sendSuccess(res, 200, 'Todo deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodoController;
