/**
 * Module dependencies.
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;
/**
 * Game Schema
*/
const GameSchema = new Schema({
  gameId: { type: String, required: true },
  gameRound: { type: Number, default: 0 },
  gameOwner: { type: Object, required: true },
  gameWinner: { type: Object, required: true },
  gamePlayers: { type: Array, default: [] },
  gameCompleted: { type: Boolean, default: false },
  gameDate: { type: Date, default: new Date().toUTCString() }
});

module.exports = mongoose.model('Game', GameSchema);
