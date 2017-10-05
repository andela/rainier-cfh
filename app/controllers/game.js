/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Game = mongoose.model('Game');

const GameData = {
  create(req, res) {
    const gameId = req.params.id;
    const game = new Game({
      game_id: gameId,
      gameOwner: req.body.gameOwner,
      gameWinner: '',
      gameRound: 0,
      gamePlayers: req.body.gamePlayers,
      gameDate: new Date(),
      gameCompleted: 'false'
    });
    game.save((err) => {
      if (err) {
        return res.status(500).json({
          message: 'An error occured while trying to save',
          error: err
        });
      }
      return res.status(200).json(game);
    });
  },
  update(req, res) {
    const owner = req.body.gameOwner;
    const gameId = req.params.id;
    const query = {
      $and: [
        { game_id: gameId }, { gameOwner: owner }
      ]
    };
    Game.update(query, {
      gameWinner: req.body.winner,
      gameCompleted: req.body.status,
      gameRounds: req.body.rounds
    }, (err, result) => {
      if (err) return res.status(500).json({ message: 'An error occured while updating game data', error: err });
      return res.status(200).json({ message: 'Game updated sucessfully', result });
    });
  },
  viewOne(req, res) {
    const gameId = req.params.gameid;
    Game.findOne({ _id: gameId })
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'An error occured while trying to search for result'
        });
      }
      return res.status(200).json({
        result
      });
    });
  },
  viewAll(req, res) {
    const userId = req.params.userid;
    Game.find({
      $or: [
        { gameOwner: userId }, { gamePlayers: userId }
      ]
    })
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'An error occured while trying to search for result'
        });
      }
      return res.status(200).json({ result });
    });
  }
};

module.exports = GameData;

