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
      const getGameLog = () => new Promise((resolve, reject) => {
        $http.get('/api/games/history', { headers: { authorization: $window.localStorage.cfhToken } })
          .success((response) => {
            resolve(response);
          })
          .error((error) => {
            reject(error);
          });
      });
      const userDonations = () => new Promise((resolve, reject) => {
        $http.get('/api/donations', { headers: { authorization: $window.localStorage.cfhToken } })
          .success((response) => {
            resolve(response);
          })
          .error((error) => {
            reject(error);
          });
      });
      return {
        getGameLog,
        userDonations
      };

      return history;
    }
  ]);
})();
