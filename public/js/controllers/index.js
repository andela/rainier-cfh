angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$cookies', '$location', '$window', 'socket', 'game', 'AvatarService', function ($scope, Global, $cookies, $location, $window, socket, game, AvatarService) {
    $scope.global = Global;
    $scope.socialAuth();

    $scope.socialAuth = () => {
      if ($cookies.generatedToken) {
        $window.localStorage.setItem('token', $cookies.generatedToken);
      }
    }

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

  }]);
