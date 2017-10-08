/*eslint-disable */
angular.module('mean.system')
  .controller('GameController', ['$scope', '$http', 'game', 'history', '$timeout', '$location', 'MakeAWishFactsService', '$dialog',
    function ($scope, $http, game, history, $timeout, $location, MakeAWishFactsService, $dialog) {
      $scope.searchText = '';
      $scope.inviteEmailBody = `Your friend has requested you play Card for Humanity together please 
                                follow the link to play`;
      $scope.searchedUsers = [];
      $scope.inviteUsers = [];
      $scope.sentEmailMessage = false;
      $scope.searchError = false;
      $scope.hasPickedCards = false;
      $scope.winningCardPicked = false;
      $scope.showTable = false;
      $scope.modalShown = false;
      $scope.game = game;
      $scope.pickedCards = [];
      let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      $scope.makeAWishFact = makeAWishFacts.pop();

      $scope.pickCard = function (card) {
        if (!$scope.hasPickedCards) {
          if ($scope.pickedCards.indexOf(card.id) < 0) {
            $scope.pickedCards.push(card.id);
            if (game.curQuestion.numAnswers === 1) {
              $scope.sendPickedCards();
              $scope.hasPickedCards = true;
            } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
              $scope.hasPickedCards = true;
              $timeout($scope.sendPickedCards, 300);
            }
          } else {
            $scope.pickedCards.pop();
          }
        }
      };

      $scope.pointerCursorStyle = function () {
        if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
          return { cursor: 'pointer' };
        }
        return {};
      };

      $scope.sendPickedCards = function () {
        game.pickCards($scope.pickedCards);
        $scope.showTable = true;
      };

      $scope.cardIsFirstSelected = function (card) {
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[0];
        }
        return false;
      };

      $scope.cardIsSecondSelected = function (card) {
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[1];
        }
        return false;
      };

      $scope.firstAnswer = function ($index) {
        if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };

      $scope.secondAnswer = function ($index) {
        if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };

      $scope.showFirst = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
      };

      $scope.showSecond = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
      };

      $scope.isCzar = function () {
        return game.czar === game.playerIndex;
      };

      $scope.isPlayer = function ($index) {
        return $index === game.playerIndex;
      };

      $scope.isCustomGame = function () {
        return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
      };

      $scope.isPremium = function ($index) {
        return game.players[$index].premium;
      };

      $scope.currentCzar = function ($index) {
        return $index === game.czar;
      };

      $scope.winningColor = function ($index) {
        if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
          return $scope.colors[game.players[game.winningCardPlayer].color];
        }
        return '#f9f9f9';
      };

      $scope.pickWinning = function (winningSet) {
        if ($scope.isCzar()) {
          game.pickWinning(winningSet.card[0]);
          $scope.winningCardPicked = true;
        }
      };

      $scope.winnerPicked = function () {
        return game.winningCard !== -1;
      };
      
      $scope.customGameOwner = function () {
        if (game.players[0] === undefined) {
          return false;
        }
        if (window.user === null) {
          return false;
        }
        return game.players[0].id === window.user._id;
      }

      // search users to invite 
      $scope.searchInviteUsers = () => {
        $scope.sentEmailInvite = false;
         $http.post('/api/search/users', { query: $scope.searchText })
          .then((response) => {
            $scope.searchedUsers = response.data;
          });
      };

      // add users to invite list
      $scope.addUserInvite = (name, email) => {
        const user = {
          name,
          email
         };
        if ($scope.containsUser(user)) {
          const index = $scope.inviteUsers.indexOf(user);
          $scope.inviteUsers.splice(index, 1);
        } else {
          $scope.inviteUsers.push(user);
        }

        console.log($scope.inviteUsers);
      };

      //helper method to check if a user is already invited
      $scope.containsUser = (user) => {
        let i;
        for (i = 0; i < $scope.inviteUsers.length; i++) {
          if ($scope.inviteUsers[i].name === user.name) {
            return true;
          }
        }

        return false;
      };
      // send invite to users//  
      $scope.sendInvite = () =>{
         const gameLink = document.URL; 
         const usersEmail = $scope.inviteUsers.map((user) => user.email);
         const message = `${$scope.inviteEmailBody} ${gameLink} `;
         
         //backend http request to send emails to invited users
         $http.post('/api/invite/send', { emails:usersEmail,message:message })
         .then(() => {
            $scope.sentEmailInvite = true;
         });
         //garbage collection 
         $scope.searchText = '';
         $scope.searchedUsers = [];
         $scope.inviteUsers = [];
         

         
      }
      
      $scope.checkUserIsInvited = (email) => {
       return $scope.inviteUsers.includes(email);
      }

      $scope.startGame = () => {
        const popupModal = $('#popUpModal');

        if (game.players.length < game.playerMinLimit) {
          popupModal.find('.modal-body')
            .text('You need a minimum of 3 players to start');
          popupModal.modal('show');
        } else {
          game.startGame();
        }
      };

      $scope.abandonGame = function () {
        game.leaveGame();
        $location.path('/dashboard');
      };

      // Catches changes to round to update when no players pick card
      // (because game.state remains the same)
      $scope.$watch('game.round', () => {
        $scope.hasPickedCards = false;
        $scope.showTable = false;
        $scope.winningCardPicked = false;
        $scope.makeAWishFact = makeAWishFacts.pop();
        if (!makeAWishFacts.length) {
          makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
        }
        $scope.pickedCards = [];
      });

      // In case player doesn't pick a card in time, show the table
      $scope.$watch('game.state', () => {
        if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
          $scope.showTable = true;
        }
      });

      $scope.$watch('game.gameID', () => {
        if (game.gameID && game.state === 'awaiting players') {
          if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
            $location.search({});
          } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
            $location.search({ game: game.gameID });
            if (!$scope.modalShown) {
              setTimeout(() => {
                const link = document.URL;
                const txt = 'Give the following link to your friends so they can join your game: ';
                $('#lobby-how-to-play').text(txt);
                $('#oh-el').css({
                  'text-align': 'center', 'font-size': '22px', background: 'white', color: 'black'
                }).text(link);
              }, 200);
              $scope.modalShown = true;
            }
          }
        }
      });
      // makes sure the games users does not exceed the game user limit before user joins
      if ($location.search().game && !(/^\d+$/).test($location.search().game) && (game.players.length > game.playerMaxLimit)) {
        const popupModal = $('#popUpModal');

        popupModal.find('.modal-body')
          .text('You cannot exceed a maximum of 12 players per game');

        popupModal.modal('show');
      } else if ($location.search().custom && game.players.length > game.playerMaxLimit) {
        popupModal.find('.modal-body')
          .text('You cannot exceed a maximum of 12 players per game');

        popupModal.modal('show');
      } else if ($location.search().game && !(/^\d+$/).test($location.search().game) && (game.players.length <= game.playerMaxLimit)) {
        console.log('joining custom game');
        game.joinGame('joinGame', $location.search().game);
      } else if ($location.search().custom && game.players.length <= game.playerMaxLimit) {
        game.joinGame('joinGame', null, true);
      } else {
        game.joinGame();
      }
    }]);
