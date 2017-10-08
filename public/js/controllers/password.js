angular.module('mean.system')
  .controller('PasswordController', ['$scope', '$http', ($scope, $http) => {
    $scope.passMessage = 'This is password reset';
    $scope.resetLink = `${document.URL}/reset`;
    $scope.resetMessage = 'You have requested password reset. Please click the link below';
    $scope.email = '';
    $scope.emailSuccess = '';
    $scope.emailError = '';

    // Send password link
    $scope.sendResetLink = () => {
      $http.post('/api/user/password', { email: $scope.email, resetLink: $scope.resetLink, resetMessage: $scope.resetMessage })
        .then((response) => {
          $scope.emailSuccess = response.data.message;
          $scope.email = '';
        }, (error) => {
          if (error) {
            $scope.emailError = error.data.message;
          }
        });
    };
    // 
  }]);

