app.controller('ReposController', function($scope, $http) {
(function() {
    // github API load repos
    $.get('/api/getRepos', function(data) {
      if (!data.error) {
        $scope.repos = data.map(function(item) {
          return {
            id : item.id,
            name : item.name,
            url : item.html_url,
            open_issues : item.open_issues_count
          }
        });
        $scope.$apply();
      } else {
        console.log(data.error)
      }
    });
  })();
});
