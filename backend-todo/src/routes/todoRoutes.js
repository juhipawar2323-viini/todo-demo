const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

// All todo routes require authentication
router.use(authMiddleware);

// CRUD routes
router.post('/', TodoController.createTodo);
router.get('/', TodoController.getTodos);
router.get('/:id', TodoController.getTodoById);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
