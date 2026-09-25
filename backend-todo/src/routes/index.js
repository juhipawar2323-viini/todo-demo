const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const todoRoutes = require('./todoRoutes');
const { sendSuccess } = require('../utils/response');

// Health Check Endpoint (GET /api/health)
router.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'Todo API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

module.exports = router;
