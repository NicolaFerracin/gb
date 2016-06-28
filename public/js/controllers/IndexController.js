app.controller('IndexController', function($scope, $http, isAuthenticated, $location, $window, $localStorage) {


  // watch oit for user logging out  $scope.$watch(function(){
  $scope.$watch(function(){
    return $localStorage.username;
  }, function(changes, old){
    // new current user, if undefined, call getRepos
    if (changes === undefined) {
      $scope.username = undefined;
    }
  });

  // check if user logged in from localStorage
  isAuthenticated.getUser().then(
    function(payload) {
      if (payload.data) {
        $scope.username = payload.data.username;
        $localStorage.username = payload.data.username;
        $localStorage.accessToken = payload.data.accessToken;
      } else {
        delete $localStorage.username;
        delete $localStorage.accessToken;
      }
    },
    function(errorPayload) {
      console.log("Error: " + errorPayload)
    });

    $scope.logout = function() {
      // user is logging out
      $http.get("/logout")
      .success(function() {
        delete $localStorage.username;
        delete $localStorage.accessToken;
        $scope.username = undefined;
        if (localStorage.getItem('privateViews').indexOf(window.location.pathname) > -1) {
          $location.path("/");
        }
      })
      .error(function(err) {
        console.log("An error occured: " + err);
      })
    }


  });
