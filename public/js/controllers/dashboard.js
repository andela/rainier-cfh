(() => {
  angular.module('mean.system')
  .controller('DashboardCtrl', ['$scope', '$http', 'game', 'history', '$window', '$location',
    function ($scope, $http, game, history, $window, $location) {

      const user = JSON.parse($window.localStorage.getItem('cfhUser'));
      const firstName = user.name.split(' ')[0];
      $scope.username = firstName.substr(0, 1).toUpperCase().concat(firstName.substr(1));

      const getEmail = () => {
        if (user.email) {
          return user.email;
        }
        user.email = 'No email supplied';
        return user.email;
      };
      $scope.email = getEmail();

      $scope.avatar = user.avatar;

      $scope.stats = [];

      
      if ($window.localStorage.cfhToken || $window.user) {
        $scope.user = game.players[game.playerIndex];
        //$scope.avatar = $scope.user.avatar;
        const onGameHistoryRes = (data) => {
          if (data === null) {
            $scope.gameLogs = [];
            return $scope.gameLogs;
          }
          console.log('gamelog data:::::::::::', data);
          $scope.gameLogs = data;
          return $scope.gameLogs;
        }

        const onGameHistoryError = (err) => {
          $scope.gameHistoryError = 'An error occured while fetching your history';
        }
        history.getGameHistory()
          .then(onGameHistoryRes, onGameHistoryError);

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
      $scope.progressMessage = "loading...."
      $scope.spinner = true;

      $scope.nextStat = () => {
        if ($scope.stats.length > 8) {
          return true;
        }
      }

      $scope.level = 0;

      $scope.maxLevel = 15;

      
    }
  ]);
})();
