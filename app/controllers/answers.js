/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const async = require('async');
const Answer = require('../models/answer');
const _ = require('underscore');


/**
 * add a new answer to database
 * @param {Object}   req  express http request object
 * @param {Object}   res  express http response object
 * @param {Function} next calls the next function in the middleware stack
 * @return {mixed}        sends an http response or calls the next middleware
 */
exports.add = (req, res, next) => {
  const answer = new Answer(req.body);
  answer.save((err, answerResponse) => {
    if (err) throw err;
    res.status(201).json({
      answer: answerResponse,
      msg: 'Answer successfully created'
    });
  });
};

/**
 * [answer description]
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 * @param  {Integer}   id  [description]
 * @return {mixed}         calls the next function in the middlewae chain
 */
exports.answer = (req, res, next, id) => {
  Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

/**
 * [show description]
 * @param  {Object} req express http request object
 * @param  {Object} res expressnhttp response object
 * @return {mixed} calls method on res
 */
exports.show = (req, res) => {
  res.jsonp(req.answer);
};

/**
 * [all description]
 * @param  {Object} req express http request object
 * @param  {Object} res expressnhttp response object
 * @return {void}
 */
exports.all = (req, res) => {
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
 * all Answers For Game
 * @param  {Function} cb callback function
 * @return {mixed}       calls cb
 */
exports.allAnswersForGame = (cb) => {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      console.log(err);
    } else {
      cb(answers);
    }
  });
};
