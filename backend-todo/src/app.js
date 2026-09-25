const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const apiRoutes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const { sendError } = require('./utils/response');

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  config.cors.frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || config.nodeEnv === 'development') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy does not allow access from the specified origin.'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. API Routes mounting
app.use('/api', apiRoutes);

// Root route welcome & docs link
app.get('/', (req, res) => {
  res.json({
    name: 'Todo Application REST API',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'online'
  });
});

// 4. Handle 404 for undefined routes
app.use((req, res) => {
  return sendError(res, 404, `Endpoint ${req.method} ${req.originalUrl} not found`);
});

// 5. Centralized Error Middleware
app.use(errorMiddleware);

module.exports = app;
