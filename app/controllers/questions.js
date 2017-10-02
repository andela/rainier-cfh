/**
 * Module dependencies.
 */
const Question = require('../models/question');

/**
 * add a new question to database
 * @param {Object}   req  express http request object
 * @param {Object}   res  express http response object
 * @param {Function} next calls the next function in the middleware stack
 * @return {mixed}        sends an http response or calls the next middleware
 */
exports.add = (req, res, next) => {
  const question = new Question(req.body);
  question.save()
    .then(() => res.send({
      success: true,
      message: 'Question added successfully'
    }))
    .catch(err => next(err));
};

/**
 *
 * @param  {Object}   req  express http request object
 * @param  {Object}   res  express http response object
 * @param  {Function} next [description]
 * @param  {Integer}   id  [description]
 * @return {mixed}         calls the next middleware in the stack
 */
exports.question = (req, res, next, id) => {
  Question.load(id, (err, question) => {
    if (err) return next(err);
    if (!question) return next(new Error(`Failed to load question ${id}`));
    req.question = question;
    next();
  });
};

/**
 * Show an question
 * @param  {Object}   req  express http request object
 * @param  {Object}   res  express http response object
 * @return {mixed}         calls method on res
 */
exports.show = (req, res) => {
  res.jsonp(req.question);
};

/**
 * List of Questions
 * @param  {Object}   req  express http request object
 * @param  {Object}   res  express http response object
 * @return {mixed}         calls method on res
 */
exports.all = (req, res) => {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id')
    .exec((err, questions) => {
      if (err) {
        res.render('error', {
          status: 500
        });
      } else {
        res.jsonp(questions);
      }
    });
};

/**
 * List of Questions (for Game class)
 * @param  {Function} cb callback function
 * @return {mixed}       calls cb
 */
exports.allQuestionsForGame = (cb) => {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id')
    .exec((err, questions) => {
      if (err) {
        console.log(err);
      } else {
        cb(questions);
      }
    });
};
