const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_production_32char',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};

// Check for critical missing environment variables in production
if (config.nodeEnv === 'production') {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    console.error('FATAL ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production.');
  }
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET must be explicitly defined in production.');
  }
}

module.exports = config;
