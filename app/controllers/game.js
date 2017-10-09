/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Game = require('../models/game');

/**
 * Save GameData on game end
 */
const GameData = {
  create(req, res) {
    const gameId = req.params.id;
      const game = new Game(req.body);
      game.userId = req.user.userId;
      game.gameId = gameId;
      game.save((err) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to save',
            error: err
          });
        }
        return res.status(201).json(game);
      });
  },
  history(req, res) {
    if (req.user) {
      Game.find({ userId: req.user.userId })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to get result'
          });
        }
        return res.status(200).json(
          result
        );
      });
    } else {
      return res.status(403).send({ message: 'You are not authorized to access this resource' });
    }
  },
  leaderboard(req, res) {
    if (req.user) {
      Game.find({ })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to get result'
          });
        }
        return res.status(200).json( result );
      });
    } else {
      return res.status(403).send({ message: 'You are not authorized to access this resource' });
    }
  }
};

module.exports = GameData;
