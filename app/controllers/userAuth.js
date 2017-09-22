const jwt = require('jsonwebtoken');
// const passport = require('passport');
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

// passport.authenticate('local', (err, user) => {
//   if (err) {
//     return res.status(401).send({
//       error: 'An error occurred'
//     });
//   }

//   if (!user) {
//     return res.status(401).send({
//       message: 'Incorrect email or password'
//     });
//   }

//   const passwordMatched = bcrypt.compareSync(req.body.password, user.hashed_password);
//   if (!passwordMatched) {
//     return res.status(409).send({
//       message: 'Invalid credentials'
//     });
//   }
//   const token = jwt.sign({
//     email: user.email,
//     userId: user.id,
//   }, process.env.JWT_SECRET, {
//     expiresIn: '10h'
//   });
//   return res.send({
//     user,
//     token
//   });
// });
