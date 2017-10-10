/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars').all();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');

require('dotenv').config();
const config = require('../../config/config');

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

exports.password = (req, res) => {
  const { email, resetLink, resetMessage } = req.body;
  // checks if email field is not empty
  if (!email || email.trim() === '') {
    return res.status(400).send({
      message: 'Please enter a valid Email address '
    });
  }

  // check if resetLink or resetMessage is not empty
  if (!resetLink || !resetMessage) {
    return res.status(400).send({
      message: 'Something went wrong'
    });
  }

  // check if user exist
  User
    .findOne({ email })
    .exec((err, user) => {
      if (!user) {
        return res.status(404).send({
          message: 'This user does not exist in our record'
        });
      }

      const token = randomstring.generate(32); // generate password token
      const resetLinkWithToken = `${resetLink}/${token}`;
      const resetPassExpiry = Date.now(); // later check if token has expired

      user.resetToken = token; // set user token
      user.resetPassExpiry = resetPassExpiry + 3600000; // set user token to expire in an hour
      user.save((err) => {
        if (err) {
          return res.send({
            message: 'Database connection error. Try again'
          });
        }
      });

      // nodemailer transporter
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
      // mail content
      const mailOptions = {
        from: '"CFH" <noreply@CFH.com>',
        to: email,
        subject: 'Cfh password',
        text: `${resetMessage}
        ${resetLinkWithToken}`
      };
      // sends email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.send({
            message: 'Unable to send email something went wrong',
            user
          });
        }

        return res.status(200).send({
          message: 'Email sent successfully'
        });
      });
    });
};

exports.resetPassword = (req, res) => {
  const { resetToken, password } = req.body;
  // checks if there is a token
  if (!password) {
    return res.status(400).send({
      message: 'Please enter password'
    });
  }
  // checks if there is a token
  if (!resetToken) {
    return res.status(400).send({
      message: 'Please provide a valid token'
    });
  }
  // checks if there is a user with token
  User
    .findOne({ resetToken })
    .exec((err, user) => {
      if (!user) {
        return res.status(404).send({
          message: 'No User associated with this Token'
        });
      }

      // checks if the token has expired
      if (Date.now() > user.resetPassExpiry) {
        return res.status(401).send({
          message: 'Token has expired'
        });
      }
      user.hashed_password = user.encryptPassword(password);
      // clear token and expiry time
      user.resetToken = '';
      user.resetPassExpiry = '';

      user.save((err) => {
        if (err) {
          return res.status(500).send({
            message: 'Database connection error. Try again'
          });
        }
        return res.status(200).send({
          message: 'password reset successfully'
        });
      });
    });
};

/**
 * Auth callback
 */

const getJWT = (tokenInfo, jwtSecret) => new Promise((resolve, reject) => {
  if (tokenInfo) {
    jwt.sign(
      tokenInfo, jwtSecret,
      (tokenError, generatedToken) => {
        if (tokenError) {
          reject(new Error(tokenError));
        } else if (generatedToken) {
          resolve(generatedToken);
        } else {
          reject(new Error('Something went wrong'));
        }
      }
    );
  } else {
    reject(new Error('No Information Supplied'));
  }
});

exports.authCallback = (req, res) => {
  getJWT(req.user.name, process.env.JWT_SECRET)
    .then((token) => {
      res.cookie('cfhToken', token);
      res.redirect('/#!/dashboard');
    })
    .catch((error) => {
      res.json(error);
    });
};

// Show login form
exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/signin');
  }
};

/**
* Show sign up form
*/

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
        const resgisteredUser = new User(req.body);
        // Switch the resgisteredUser's avatar index to an actual avatar url
        resgisteredUser.avatar = avatars[resgisteredUser.avatar];
        resgisteredUser.provider = 'local';
        resgisteredUser.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              resgisteredUser
            });
          }
          req.logIn(resgisteredUser, (err) => {
            if (err) return next(err);
            const token = jwt.sign({ resgisteredUser }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME });
            const user = {
              name: resgisteredUser.name,
              email: resgisteredUser.email,
              avatar: resgisteredUser.avatar,
              id: resgisteredUser._id,
              donations: resgisteredUser.donations,
            };
            res.status(201).json({
              token,
              user
            });
          });
        });
      } else {
        return res.status(409).json({
          error: 'Email address already in use'
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
  User.findOne({ email: req.body.email }, (err, returnedUser) => {
    if (returnedUser) {
      const passwordMatched = bcrypt.compareSync(req.body.password, returnedUser.hashed_password);
      if (!passwordMatched) {
        return res.status(401).send({
          error: 'Email or password incorrect',
        });
      }
      const token = jwt.sign({
        email: returnedUser.email,
        userId: returnedUser.id,
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME
      });
      const user = {
        name: returnedUser.name,
        email: returnedUser.email,
        id: returnedUser._id,
        donations: returnedUser.donations,
        avatar: returnedUser.avatar,
      };
      return res.send({
        user,
        token
      });
    }
    return res.status(401).send({ error: 'Email or password incorrect' });
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
// add donation
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
// get donation
exports.getDonations = (req, res) => {
  if (req.user) {
    User.findById(req.user.userId)
      .select('donations')
      .exec((error, allDonations) => {
        if (error) {
          return res.status(500).send({ error });
        }
        return res.status(200).json(allDonations);
      });
  }
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
