app.controller('SingleRepoController', function($scope, $http, $location, $localStorage) {

  var urlSplit = $location.path().split("/");
  $scope.repoName = urlSplit.pop();
  $scope.selectedLabels = [];
  var labels = [];

  getIssues = function() {
    // github API load issues
    $http({
      method: 'GET',
      url: 'https://api.github.com/repos/' + $localStorage.username + '/' + $scope.repoName  + '/issues?state=all'
    }).then(function successCallback(data) {
      $scope.issues = data.data.map(function(item) {
        return {
          url : item.html_url,
          title : item.title,
          body : item.body,
          labels : item.labels,
          state : item.state
        }
      });
      // order issues by open first
      $scope.issues.sort(compare);
      // change issues state to uppercase
      $scope.issues.forEach(function(el) {
        el.state = el.state[0].toUpperCase() + el.state.substring(1);
      });
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  getLabels = function() {
    // github API load labels
    $http({
      method: 'GET',
      url: 'https://api.github.com/repos/' + $localStorage.username + '/' + $scope.repoName  + '/labels'
    }).then(function successCallback(data) {
      labels = data.data.map(function(item) {
        return {
          name : item.name,
          color : item.color
        }
      })
      $scope.labels = labels;
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  $scope.createIssue = function(form) {
    // disable submit
    $("#submitNewIssueBtn").prop('disabled', true);
    // submit new issue through github api
    $http({
      method: 'POST',
      headers : {
        'Authorization' : 'token ' + $localStorage.accessToken,
      },
      url: 'https://api.github.com/repos/' + $localStorage.username + '/' + $scope.repoName  + '/issues',
      data: {title : form.title, body : form.body, labels : $scope.selectedLabels.map(function(item) { return item.name })}
    }).then(function successCallback(data) {
      getIssues();
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      console.log('error', response);
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    // reset form and labels
    $scope.issue = {};
    $scope.labels = labels;
    $scope.selectedLabels = [];
    // reenable submit
    $("#submitNewIssueBtn").prop('disabled', false);
    // hide modal
    $("#newIssue").modal("hide");
  };

  $scope.selectLabel = function(index) {
    $scope.selectedLabels.push($scope.labels[index]);
    $scope.labels.splice(index, 1);
  }

  $scope.removeLabel = function(index) {
    $scope.labels.push($scope.selectedLabels[index]);
    $scope.selectedLabels.splice(index, 1);
  }

  // to order issues by open first
  function compare(a,b) {
    if (a.state === "open") {
      return -1;
    }
    if (a.state !== "open") {
      return 1;
    }
    return 0;
  }

  getIssues();
  getLabels();
});
