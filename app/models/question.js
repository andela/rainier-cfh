/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  config = require('../../config/config'),
  { Schema } = mongoose;

/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  numAnswers: {
    type: Number,
    required: true
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  },
  region: {
    type: String,
    default: 'Africa',
    trim: true
  }
});

/**
 * Statics
 */
QuestionSchema.statics = {
  load(id, cb) {
    this.findOne({ id }).select('-_id').exec(cb);
  }
};

module.exports = mongoose.model('Question', QuestionSchema);

