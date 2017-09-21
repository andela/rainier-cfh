/**
 * Module dependencies.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = mongoose.model('User');
const avatars = require('./avatars').all();

dotenv.config();
/**
* Auth callback
*/
exports.authCallback = function (req, res, next) {
  res.redirect('/chooseavatars');
};

/**
* Show login form
*/
exports.signin = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
* Show sign up form
*/
exports.signup = function (req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
* Logout
*/
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
* Session
*/
exports.session = function (req, res) {
  res.redirect('/');
};

/**
* Check avatar - Confirm if the user who logged in via passport
* already has an avatar. If they don't have one, redirect them
* to our Choose an Avatar page.
*/
exports.checkAvatar = function (req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
* Create user
*/

exports.create = (req, res, next) => {
  if (!req.body.name || !req.body.password || !req.body.email) {
    return res.status(400).json({
      error: 'Field cannot be empty'
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
            token
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
  const email = req.body.email || null;
  const password = req.body.password || null;
  if (!email || !password) {
    return res.status(400).json({
      message: 'Field cannot be empty'
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
        success: true,
        message: 'Login successful',
        token
      });
    }
  });
};

/**
* Assign avatar to user
*/
exports.avatars = function (req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = function (req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          var duplicate = false;
          for (var i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
*  Show profile
*/
exports.show = function (req, res) {
  let user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
* Send User
*/
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
* Find user by id
*/
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};
