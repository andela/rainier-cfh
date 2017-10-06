/* eslint-disable */
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
    if (req.user && req.user.id) {
      const game = new Game(req.body);
      game.userId = req.user.id;
      game.gameId = req.params.id;
      game.save((err) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to save',
            error: err
          });
        }
        return res.status(200).json(game);
      });
    } else {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
  },
  viewOne(req, res) {
    const gameId = req.params.id;
    if (req.user && req.user.id) {
      Game.findOne({ _id: gameId })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to get result'
          });
        }
        return res.status(200).json({
          result
        });
      });
    } else {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
  },
  viewAll(req, res) {
    const userId = req.params.userid;
    if (req.user && req.user.id) {
      Game.find({ userId })
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'An error occured while trying to get result'
          });
        }
        return res.status(200).json({ result });
      });
    } else {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
  }
};

module.exports = GameData;
