const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a signed JWT token
 * @param {Object} payload - Data to embed in the JWT (e.g. { id, email })
 * @returns {string} - Signed JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Verify a JWT token
 * @param {string} token - Bearer JWT string
 * @returns {Object} - Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};
