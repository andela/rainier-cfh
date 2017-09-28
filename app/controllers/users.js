/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars').all();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();





// authenticated route to search for users with name or username
exports.search = (req, res) => {
  const { query } = req.body;

  // throws error if user does enter query string
  if (!query || query.trim() === '') {
    return res.status(202).send({
      message: 'Please enter a search query'
    });
  }
  User
    .find({
      $or: [
        { username: { $regex: `.*${query}.*` } }, // regex to return users' username or name that match the query string
        { name: { $regex: `.*${query}.*` } }
      ]
    })
    .select('name username email')
    .sort('name')
    .limit(20)
    .exec((err, users) => {
      if (err) {
        return res.status(400).send({ message: 'Error retrieving user' });
      }
      if (!users.length) {
        return res.status(202).send({ message: 'No users found' });
      }
      return res.status(200).send(users);
    });
};

// send email invite to users
exports.sendInviteEmail = (req, res) => {
  const { emails, message } = req.body;
  // creates a transporter to send email //
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
 });

  const mailOptions = {
    from: '"CFH" <invite@CFH.com',
    to: emails,
    subject: 'Cfh Game Invite',
    text: message
  };
  // transporter sending the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send({
        message: 'Unable to send email something went wrong'
      });
    }

    return res.status(200).send({
      message: 'Email sent successfully'
    });
  });
};

/**
 * Auth callback
 */


exports.authCallback = (req, res, next) => {
  res.redirect('/chooseavatars');
};

// Show login form
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

  User
    .findOne({
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

/*
 * Check avatar - Confirm if the user who logged in via passport

 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */

exports.checkAvatar = (req, res) => {
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
    // If user doesnt even exist, redirect to
    res.redirect('/');
  }
};

/**
 * Create user
 */

exports.create = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
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
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
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

exports.avatars = (req, res) => {
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

exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
        // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
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

exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */

exports.me = (req, res) => {
  res.json(req.user || null);
};

/**
 * Find user by id
 */

exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};
