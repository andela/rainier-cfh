/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const async = require('async');
const Answer = require('../models/answer');
const _ = require('underscore');


/**
 * [answer description]
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 * @param  {Integer}   id   [description]
 * @return {undefined}        calls the next function in the middlewae chain
 */
export const answer = (req, res, next, id) => {
  Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

/**
 * [show description]
 * @param  {Object} req [description]
 * @param  {Object} res [description]
 * @return {[type]}     [description]
 */
export const show = (req, res) => {
  res.jsonp(req.answer);
};

/**
 * [all description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const all = (req, res) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(answers);
    }
  });
};

/**
 * [allAnswersForGame description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
exports.allAnswersForGame = (cb) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      cb(answers);
    }
  });
};
