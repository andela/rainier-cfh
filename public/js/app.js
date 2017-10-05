/* eslint-disable */
angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap','ngStorage', 'ui.route', 'mean.system', 'mean.directives','firebase'])
  .config(['$routeProvider',
      function($routeProvider) {
          $routeProvider.
          when('/', {
            templateUrl: 'views/index.html'
          }).
          when('/app', {
            templateUrl: '/views/app.html',
          }).
          when('/privacy', {
            templateUrl: '/views/privacy.html',
          }).
          when('/bottom', {
            templateUrl: '/views/bottom.html',
          }).
          when('/signin', {
            templateUrl: '/views/signin.html',
            resolve: {
              auth: function (RedirectService) {
                return RedirectService.redirect();
              }
            },
          }).
          when('/signup', {
            templateUrl: '/views/signup.html',
            resolve: {
              auth: function (RedirectService) {
                return RedirectService.redirect();
              }
            },
          }).
          when('/choose-avatar', {
            templateUrl: '/views/choose-avatar.html'
          }).
          when('/dashboard', {
            templateUrl: '/views/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
              auth: function (AuthService) {
                return AuthService.authenticate();
              }
            }
          }).
          otherwise({
            redirectTo: '/'
          });
      }
  ]).constant('FirebaseUrl', 'https://cfh-app.firebaseio.com/')
  .config(function(){
    const config = {
      apiKey: "AIzaSyC_n3dNaGYvnw9R4N32wgqzwKtL5_tKH0o",
      authDomain: "cfh-app.firebaseapp.com",
      databaseURL: "https://cfh-app.firebaseio.com",
      projectId: "cfh-app",
      storageBucket: "cfh-app.appspot.com",
      messagingSenderId: "1008700339101"
    };
    firebase.initializeApp(config);
  })
  .config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.hashPrefix("!");
    }
  ]).run(['$rootScope', function($rootScope) {
  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
            fn();
        }
    } else {
        this.$apply(fn);
      }
    };
  }]).run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]).factory('AuthService', function($q, $window) {
    return {
      authenticate: function () {
        const isAuthenticated = localStorage.getItem('cfhToken');
        if (isAuthenticated) {
          return true;
        } else {
          $window.location.href = '/#!/signin';
        }
        return $q.reject('Not Authenticated');
      }
    }
  }).factory('RedirectService', function($q, $window) {
    return {
      redirect: () => {
        const isAuthenticated = localStorage.getItem('cfhToken');
        if (!isAuthenticated) {
          return true;
        } else {
          $window.location.href = '/#!/dashboard';
        }
        return $q.reject('Not Authenticated');
      }
    }
  });

angular.module('mean.system', []);
angular.module('mean.directives', []);
