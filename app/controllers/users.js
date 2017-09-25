/**
 * Module dependencies.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = mongoose.model('User');
const avatars = require('./avatars').all();

/**
* Show login form
*/

exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
* Show sign up form
*/

exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
* Signout
*/

exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
* Session
*/

exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Sign Up
 */

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

/**
 * Sign In
 */

exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: 'All Fields are required'
    });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!err) {
      const passwordMatched = bcrypt.compareSync(req.body.password, user.hashed_password);
      if (!passwordMatched) {
        return res.status(409).send({
          message: 'Invalid credentials'
        });
      }
      const token = jwt.sign({
        email: user.email,
        userId: user.id,
      }, process.env.JWT_SECRET, {
        expiresIn: '10h'
      });
      return res.send({
        user,
        token
      });
    }
  });
};

