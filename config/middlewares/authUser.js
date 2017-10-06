require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const token = req.header('authorization');
  if (!token) {
    return res.status(401).json('Unauthorized: No token provided');
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(400).json('Invalid token');
    }
    User.findById(decoded.id)
      .then((user) => {
        if (!user) {
          return Promise.reject('This token is invalid or has expired');
        }
        req.user = decoded;
        return next();
      })
      .catch(err => res.status(500).json(err));
  });
};
