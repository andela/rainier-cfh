(() => {
  angular.module('mean.system')
  .factory('history', ['$http', '$window',
    ($http, $window) => {
      const getGameHistory = () => {
        return $http.get(`/api/games/history`, { headers: { authorization: $window.localStorage.cfhToken } })
          .then((response) => {
            return response.data;
          }
        );
      };
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
