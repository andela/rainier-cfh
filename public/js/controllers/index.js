angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$cookieStore', '$cookies', '$location', '$http', '$window', 'socket', 'game', 'AvatarService', function ($scope, Global, $cookieStore, $cookies, $location, $http, $window, socket, game, AvatarService) {
    $scope.global = Global;

    $scope.socialAuth = () => {
      if ($cookies.cfhToken) {
        window.localStorage.setItem('cfhToken', $cookies.cfhToken);
        window.location.href = '/#!/dashboard';
      }
    };

    $scope.socialAuth();

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;

    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then((data) => {
        $scope.avatars = data;
      });

    $scope.signin = (userInput) => {
      $scope.error = '';
      $http.post('/api/auth/login', userInput)
        .success((response) => {
          if (response.token) {
            window.localStorage.setItem('cfhToken', response.token);
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
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
      $scope.error = '';
      const validation = $scope.validateInput(userInput);
      if (validation) {
        $http.post('/api/auth/signup', userInput)
          .success((response) => {
            console.log(response);
            if (response.token) {
              window.localStorage.setItem('cfhToken', response.token);
              $window.location.href = '/#!/dashboard';
            }
          })
          .error((error) => {
            $scope.error = error.error;
          });
      }
    };

    $scope.signout = () => {
      localStorage.removeItem('cfhToken');
      $cookieStore.remove('cfhToken');
      $window.location.href = '/#!/signin';
    };
  }]);
