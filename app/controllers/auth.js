const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = mongoose.model('User');
const avatars = require('./avatars').all();

exports.signup = (req, res, next) => {
  if (!req.body.name || !req.body.password || !req.body.email) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  User.findOne({
    email: req.body.email
  }).exec((err, existingUser) => {
    if (!existingUser) {
      const user = new User(req.body);
      // Switch the user's avatar index to an actual avatar url
      user.avatar = avatars[user.avatar];
      user.provider = 'local';
      user.save((err) => {
        if (err) {
          return res.render('/#!/signup?error=unknown', {
            errors: err.errors,
            user
          });
        }
        req.logIn(user, (err) => {
          if (err) return next(err);
          const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '10h' });

          res.status(200).json({
            message: 'User created successfully',
            token,
            user
          });
        });
      });
    } else {
      return res.status(409).json({
        error: 'User already exists'
      });
    }
  });
};
