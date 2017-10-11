angular.module('mean.system')
  .controller('PasswordController', ['$scope', '$http', '$routeParams', ($scope, $http, $routeParams) => {
    $scope.passMessage = 'This is password reset';
    $scope.resetLink = `${document.URL}/reset`;
    $scope.resetMessage = 'You have requested password reset. Please click the link below. The link expires in 1 hour';
    $scope.email = '';
    $scope.emailSuccess = '';
    $scope.emailError = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.resetError = '';
    $scope.resetSuccess = '';
    $scope.emailSent = false;

    // Send password link
    $scope.sendResetLink = () => {
      $scope.emailSent = true;
      $http.post('/api/user/password', { email: $scope.email, resetLink: $scope.resetLink, resetMessage: $scope.resetMessage })
        .then((response) => {
          $scope.emailSuccess = response.data.message;
          $scope.emailError = '';
          $scope.email = '';
          $scope.emailSent = false;
        }, (error) => {
          if (error) {
            $scope.emailError = error.data.message;
            $scope.emailSuccess = '';
            $scope.emailSent = false;
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

