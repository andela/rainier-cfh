/* eslint-disable */
(() => {
  /**
  * angular
  * Description: Angular
  */
  angular.module('mean.system')
  /**
  * history services
  * Description: setup a history service
  */
  .factory('history', ['$http', '$window',
    ($http, $window) => {

      // method that gets game history
      const getGameHistory = () => {
        return $http.get(`/api/games/history`, { headers: { authorization: $window.localStorage.cfhToken } })
          .then((response) => {
            return response.data;
          }
        );
      };

      // method that gets game leaderboard
      const getGameLeaderboard = () => {
        return $http.get('/api/leaderboard', { headers: { authorization: $window.localStorage.cfhToken } })
          .then((response) => {
            return response.data;
          }
        );
      };
      const userDonations = () => {
        return $http.get('/api/donations', { headers: { authorization: $window.localStorage.cfhToken } })
          .then((response) => {
            return response.data;
          }
        );
      };

      return {
        getGameHistory,
        getGameLeaderboard,
        userDonations
      };

      return history;
    }
  ]);
})();
