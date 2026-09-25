const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected current user profile route
router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
