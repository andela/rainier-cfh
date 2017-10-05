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
  .controller('DashboardCtrl', ['$scope', '$http', 'game', '$location',
    function ($scope, $http, game, $location) {
      // user stats is an array of object
      $scope.stats = [];
      // user starts with a default level of zero
      $scope.level = 0;
      // Maximum level attainable
      $scope.maxLevel = 15;

      // Todo: implement the endpoint that serves userData
      //User Data

      // implementation details for user data fetching error
      const onUserError = (reason) => {
        $scope.userError = 'An error occured fetching your data';
      }
      const userRes = (response) => {
        $scope.user = response.data;
      }
      $http.get('/userData').then(userRes, onUserError);

      // Todo: implement the endpoint that serves userStats
      //User Stats
      // implementation details of user stats promise
      const statsRes = (response) => {
        $scope.stats = response.data;
      }
      // implementation details of stats error
      const onStatsError = (reason) => {
        $scope.statsError = 'An error occured fetching your stats'
      }

      $http.get('/userStats').then(statsRes, onStatsError);

      // Todo: write algorithm for calculating user rating and level
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

      $scope.nextStat = () => {
        if ($scope.stats.length > 8) {
          return true;
        }
      }
      
    }
  ]);
})();
