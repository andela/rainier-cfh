require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json('Unauthorized: No access token provided');
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json('Invalid token');
    }
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(404)('User not found');
        }
        req.user = decoded;
        return next();
      })
      .catch(err => res.status(500).json({ err }));
  });
};
