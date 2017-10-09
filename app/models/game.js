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
  userId: { type: String, required: true },
  gameRound: { type: Number, default: 0 },
  gameWinner: { type: Object, required: true },
  gamePlayers: { type: Array, default: [] },
  gameDate: { type: Date, default: new Date().toUTCString() }
});

module.exports = mongoose.model('Game', GameSchema);
