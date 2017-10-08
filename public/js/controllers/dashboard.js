/* eslint-disable */
(() => {
  /**
  * angular
  * Description: Angular
  */
  angular.module('mean.system')
  /**
  * DashboardCtrl
  * Description: sets up a controller
  */
  .controller('DashboardCtrl', ['$scope', '$http', 'game', 'history', '$window', '$location',
    function ($scope, $http, game, history, $window, $location) {

      // get user data from local storage
      $scope.user = JSON.parse($window.localStorage.getItem('cfhUser'));
      $scope.username = $scope.user.username.substr(0,1).toUpperCase().concat($scope.user.username.substr(1));

      // initialize game history to an empty array
      $scope.stats = [];

      
      if ($window.localStorage.cfhToken || window.user) {
        // game history success ::> populate dashboard
        const onGameHistoryRes = (data) => {
          if (data === null) {
            $scope.gameLogs = [];
            return $scope.gameLogs;
          }
          $scope.gameLogs = data
          return $scope.gameLogs;
        }
        // game history failure ::> notify user
        const onGameHistoryError = (err) => {
          $scope.gameHistoryError = 'An error occured while fetching your history';
        }
        history.getGameHistory()
          .then(onGameHistoryRes, onGameHistoryError);


        // get game leaderboard and view on request
        history.getGameLeaderboard()
          .then((gameLogs) => {
            const leaderboard = [];
            const players = {};
            gameLogs.forEach((gameLog) => {
              const numOfWins = players[gameLog.gameWinner];
              if (numOfWins) {
                players[gameLog.gameWinner] += 1;
              } else {
                players[gameLog.gameWinner] = 1;
              }
            });
            Object.keys(players).forEach((key) => {
              leaderboard.push({ username: key, numberOfWins: players[key] });
            });
            $scope.leaderboard = leaderboard;
          });
        // user donations logic
        history.userDonations()
          .then((userDonations) => {
            $scope.userDonations = userDonations.donations;
          });
      }
   

      // Todo: write algorithm for generating user stats, calculating user rating and level
      // $scope.getLevel = () => {
      //   const level = 0;
      //   const winRatio = 0;
      //   const baseRatio = 1.5;
      //   if ($scope.stats.played < 10) {
      //     return level;
      //   }
      //   else {
      //     winRatio = $scope.stats.played / $scope.stats.won;
      //     switch($scope.stats.played) {
      //       case $scope.stats.played > 10:
      //         if(winRatio <= baseRatio) {
      //           level = 1;
      //           return level;
      //         }
      //         break;
      //       case $scope.stats.played > 20:
      //         if(winRatio <= baseRatio) {
      //           level= 2
      //           return level;
      //         }
      //         break;
      //       default:
      //         return level;
      //     }
      //   }
      // }

      //  $scope.user[level] = getLevel(),
      //  $scopr.user[rating] =  getRating()
      $scope.progressMessage = "....loading"
      $scope.spinner = true;

      $scope.nextStat = () => {
        if ($scope.stats.length > 8) {
          return true;
        }
      }
      // user starts with a default level of zero
      $scope.level = 0;
      // Maximum level attainable
      $scope.maxLevel = 15;

      
    }
  ]);
})();
