app.controller('SingleRepoController', function($scope, $http, $location) {

  var urlSplit = $location.path().split("/");
  $scope.repoName = urlSplit.pop();
  $scope.selectedLabels = [];
  var labels = [];

  getIssues = function() {
    // github API load issues
    $.get('/api/getIssues', { 'repo' : $scope.repoName }, function(data) {
      if (!data.error) {
        $scope.issues = data.map(function(item) {
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
        $scope.$apply();
      } else {
        console.log(data.error)
      }
    });
  };

  getLabels = function() {
    // github API load labels
    $.get('/api/getLabels', { 'repo' : $scope.repoName }, function(data) {
      if (!data.error) {
        labels = data.map(function(item) {
          return {
            name : item.name,
            color : item.color
          }
        })
        $scope.labels = labels;
        $scope.$apply();
      } else {
        console.log(data.error)
      }
    });
  };

  $scope.createIssue = function(form) {
    // disable submit
    $("#submitNewIssueBtn").prop('disabled', true);
    // add labels to form
    form.labels = $scope.selectedLabels.map(function(item) { return item.name });
    // submit new issue through github api
    $.post('/api/createIssue', { 'repo' : $scope.repoName, 'form' : form }, function(data) {
      if (!data.error) {
        console.log("new issue created");
        getIssues();
      } else {
        console.log(data.error)
      }
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
