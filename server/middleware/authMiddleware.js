const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'arvix_civic_portal_super_secret_jwt_key_2024';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = inMemoryStore.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User authorization failed, record not found'
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware] Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided'
    });
  }
};

const requireRepresentative = (req, res, next) => {
  if (req.user && (req.user.role === 'representative' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access restricted: Ward Representative or Administrator privileges required.'
    });
  }
};

module.exports = { protect, requireRepresentative, JWT_SECRET };
