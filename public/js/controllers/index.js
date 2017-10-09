/* global angular */
/* global $ */
/* global localStorage */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$rootScope', '$http', '$window', '$location', 'socket', 'game', 'AvatarService',
  function ($scope, Global, $rootScope, $http, $window, $location, socket, game, AvatarService) {
    $scope.global = Global;
    $scope.playerRegion = 'Africa';

    $scope.gamePlay = (play) => {
      $scope.setPlayerRegion = (region) => {
        switch (region) {
          case 'Asia':
            $scope.playerRegion = region;
            localStorage.setItem('region', region);
            if (play === 'guest') {
              location.href = '/#!/app';
            }
            if (play === 'strangers') {
              location.href = '/play';
            }
            if (play === 'friends') {
              location.href = '/play?custom';
            }
            break;
          case 'Europe':
            $scope.playerRegion = region;
            localStorage.setItem('region', region);
            if (play === 'guest') {
              location.href = '/#!/app';
            }
            if (play === 'strangers') {
              location.href = '/play';
            }
            if (play === 'friends') {
              location.href = '/play?custom';
            }
            break;
          case 'Africa':
            $scope.playerRegion = region;
            localStorage.setItem('region', region);
            if (play === 'guest') {
              location.href = '/#!/app';
            }
            if (play === 'strangers') {
              location.href = '/play';
            }
            if (play === 'friends') {
              location.href = '/play?custom';
            }
            break;
          default:
            location.href = '/';
        };
      }
    } 

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });
      $scope.storeData = (response) => {
        localStorage.setItem('cfhToken', response.token);
        localStorage.setItem('cfhUser', JSON.stringify(response.user));
        $window.location.href='/#!/dashboard';
      }
      $scope.signin = (userInput) => {
        $scope.error = '';
       $http.post('/api/auth/login', userInput)
       .success((response) => {
        if(response.token) {
          localStorage.setItem('cfhToken', response.token);
          const userData = {
            userId: response.user._id,
            username: response.user.name,
            email: response.user.email,
            donation: response.user.donation
          }
          localStorage.setItem('cfhUser', JSON.stringify(userData));
          $rootScope.authenticated = true;
          $window.location.href = '/#!/dashboard';
        }
       })
       .error((error) => {
        $scope.error = error.error;
        $rootScope.authenticated = false;
       });
      };

      $scope.validateInput = (userInput) => {
        const emailRegex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!/^[a-zA-Z0-9 ]*$/.test(userInput.name)) {
          $scope.error = 'Name cannot contain special characters';
          return false;
        }
        if (!userInput.password) {
          $scope.error = 'password cannot be all spaces';
          return false;
        }
        if (userInput.password.length < 6) {
          $scope.error = 'password cannot be less than 6 characters';
          return false;
        }
        if (!emailRegex.test(userInput.email)) {
          $scope.error = 'Wrong email address entered';
          return false;
        }
        return true;
      };

      $scope.signup = (userInput) => {
        // empty error variable before new validation
        $scope.error='';
        const validation = $scope.validateInput(userInput);
        if (validation) {
          $http.post('/api/auth/signup', userInput)
          .success((response) => {
            if (response.token) {
              $window.localStorage.setItem('cfhToken', response.token);
                const userData = {
                  userId: response.user._id,
                  username: response.user.name,
                  email: response.user.email,
                  donation: response.user.donation
                }
                localStorage.setItem('cfhUser', JSON.stringify(userData));
                $rootScope.authenticated = true;
                $window.location.href = '/#!/dashboard';
              }
          })
          .error((error) => {
            $scope.error = error.error;
          });
        }
      };

    $scope.signout = () => {
      localStorage.clear();
      $window.location.href='/#!/signin';
    };
}]);
