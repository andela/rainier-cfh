angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$http', '$window', '$location', 'socket', 'game', 'AvatarService', function ($scope, Global, $http, $window, $location, socket, game, AvatarService) {
    $scope.global = Global;

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

      $scope.signin = (userInput) => {
       $http.post('/api/auth/login', userInput)
       .success((response) => {
        if(response.token) {
          window.localStorage.setItem('cfhToken', response.token);
          $window.location.href='/#!';
        }
       })
       .error((error) => {
         alert('login not successful');
        console.log(error);
       });
      };
      $scope.validateInput = (userInput) => {

      }
      $scope.signup = (userInput) => {
        $http.post('/api/auth/signup', userInput)
        .success((response) => {
          console.log(response);
        })
        .error((error) => {
          console.log(error);
        });
      };
}]);