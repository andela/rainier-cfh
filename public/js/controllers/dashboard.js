/*eslint-disable */
(() => {
  /**
  * angular
  * Description: Angular
  */
  const dashboard = angular
  /**
  * app
  * Description: sets up initial state of the dashboard
  */
  .module('dashboard', ['ngMaterial'])
  /**
  * MainCtrl
  * Description: setup a controller
  */
  const MainCtrl = ($scope, $http, $mdDialog, $location) => {
    // Todo: this should come from the server
    //User stats
    $scope.user = {
      username: "Tommy",
      email: "tommy.jones@google.com",
      avatar: "",
      level: 5,
      rating: 3,
    };
    // Todo: this should come from server
    $scope.stats = [
      {
        date: '1/10/2017',
        played: 15,
        won: 10,
        lost: 5,
        donation: 50
      },
      {
        date: '3/10/2017',
        played: 5,
        won: 5,
        lost: 0,
        donation: 0
      }
    ]
    
    $scope.maxLevel = 15;

/**
* gamePlay()
*/
      $scope.gamePlay = function(which) {
    $mdDialog.show({
      controller: DialogController,
      template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"><h6><i class="fa fa-info-circle"></i>&nbsp;&nbsp;Start game with friends</h6><p>This game contains offensive, profane, explicit content created by Cards Against Humanity&trade; and provided here, uncensored and complete, in digital form. Human Resources made us say that.</p></md-content> <div class="md-dialog-actions" layout="row"> <span flex></span> <md-button ng-click="cancel()"> Cancel </md-button> <md-button ng-click="startGame(which)" class="md-primary"> Start </md-button> </div></md-dialog>',
    })
  };
    
  };
  /**
  * DialogController()
  */
  function DialogController($scope, $mdDialog, $location) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.startGame = function(friends) {
    switch(friends){
  case 'friends':
          $location.path('/play?custom');
  $mdDialog.hide(friends);
  break;
        case 'strangers':
          $location.path('/play');
  $mdDialog.hide(strangers);
  break;
      default:
  $mdDialog.hide(friends);
     }
  };
};
  
  dashboard.controller("MainCtrl", ['$scope', '$http', '$mdDialog', MainCtrl]);
})();
