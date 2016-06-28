app.controller('ReposController', function($scope, $http, isAuthenticated, $location, $localStorage) {

  $scope.repos = [];
  var getRepos;

  $scope.$watch(function(){
    return $localStorage.username;
  }, function(changes, old){
    // new current user, if undefined, call getRepos
    if (changes !== undefined) {
      getRepos();
    }
  });


  getRepos = function() {
    // github API load repos
    $http({
      method: 'GET',
      url: 'https://api.github.com/users/' + $localStorage.username + '/repos'
    }).then(function successCallback(data) {
      $scope.repos = data.data.map(function(item) {
        return {
          id : item.id,
          name : item.name,
          url : item.html_url,
          open_issues : item.open_issues_count
        }
      });
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      console.log("error", response)
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }
});
