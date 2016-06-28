// angular routing
var app = angular.module('BoilerplateApp', ['ngRoute', 'ngStorage']);

// run for every route changes, to check if the next route is private or not
app.run(function($rootScope, $location, $http) {
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    localStorage.setItem('privateViews', ['views/repos.html', 'views/singleRepo.html']); // include private views/routes, as "views/private.html"
    // if the url is private
    if (localStorage.getItem('privateViews').indexOf(next.templateUrl) > -1) {
      // check if user is logged in
      // if NOT logged in redirect to login page
      $http.get("/isAuthenticated")
      .success(function(data) {
        if (!data) {
          $location.path("/");
        }
      })
      .error(function(err) {
        console.log("An error occured: " + err);
      })

    }
  });
});

// route provider to redirect the user to the requested view, using a single page application setup
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/auth/github', {
    controller : function() {
      window.location.replace('/auth/github');
    },
    template : " "
  })
  .when('/app', {
    controller: 'IndexController',
    templateUrl: 'views/home.html'
  })
  .when('/repos', {
    controller: 'ReposController',
    templateUrl: 'views/repos.html'
  })
  .when('/repos/:user/:repo', {
    controller: 'SingleRepoController',
    templateUrl: 'views/singleRepo.html'
  })
  .otherwise({
    controller: function() {
      return;
    },
    templateUrl: 'views/home.html'
  });

  // use the HTML5 History API
  // this line is needed because the SPA urls would show # characters otherwise. It also needs line 6 in index.html
  $locationProvider.html5Mode(true);
});

// to call when you want to check if the user is online
app.factory('isAuthenticated', function($http) {
    return {
      getUser: function() {
         return $http.get('/isAuthenticated');
      }
    }
  });
