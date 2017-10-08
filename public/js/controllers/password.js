angular.module('mean.system')
  .controller('PasswordController', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
    $scope.passMessage = 'This is password reset';
    $scope.resetLink = `${document.URL}/reset`;
    $scope.resetMessage = 'You have requested password reset. Please click the link below';
    $scope.email = '';
    $scope.emailSuccess = '';
    $scope.emailError = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.resetError = '';
    $scope.resetSuccess = '';

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
    // reset the password
    $scope.resetPassword = () => {
      if ($scope.password !== $scope.confirmPassword) {
        $scope.resetError = 'Passwords do not match';
        return;
      }
      // check if password and confirm are the same and whether password are entered
      $http.post('/api/user/password/reset', { resetToken: $routeParams.token, password: $scope.password })
        .then((response) => {
          $scope.resetSuccess = response.data.message;
          $scope.password = '';
          $scope.confirmPassword = '';
        }, (error) => {
          if (error) {
            $scope.resetError = error.data.message;
          }
        });
    };
  }]);

