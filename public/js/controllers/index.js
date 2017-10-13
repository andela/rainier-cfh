/* global angular */
/* global $ */
/* global localStorage */

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

      $scope.storeData = (response) => {
        localStorage.setItem('cfhToken', response.token);
        localStorage.setItem('cfhUser', JSON.stringify(response.user));
        console.log(response);
        $window.location.href='/#!/dashboard';
      }

      $scope.signin = (userInput) => {
        // disable sigin button till the request resolves
        $scope.buttonDisabled = 'disabled';
        $scope.error = '';
       $http.post('/api/auth/login', userInput)
       .success((response) => {
         $scope.storeData(response);
         $scope.buttonDisabled ='';
       })
       .error((error) => {
        $scope.buttonDisabled ='';
        $scope.error = error.error;
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
      // disable sigup button till the request resolves
      $scope.buttonDisabled = 'disabled';
      const validation = $scope.validateInput(userInput);
      if (validation) {
        $http.post('/api/auth/signup', userInput)
          .success((response) => {
            $scope.buttonDisabled = '';
           $scope.storeData(response);
          })
          .error((error) => {
            $scope.buttonDisabled = '';
            $scope.error = error.error;
          });
      }
    };

    $scope.signout = () => {
      localStorage.removeItem('cfhToken');
      localStorage.removeItem('cfhUser');
      $cookieStore.remove('cfhToken');
      $window.location.href = '/#!/signin';
    };
  }]);
