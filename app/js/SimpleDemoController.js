meetingPlannerApp.controller('SimpleDemoController', function ($scope) {
	$scope.models = {
        selected: null,
        lists: {"Activities": [], "Meeting1": [], "Meeting2": [], "Meeting3": []}
    };

    // Generate initial model
    for (var i = 1; i <= 3; ++i) {
        $scope.models.lists.Activities.push({label: "20 min Activity" + i});
        $scope.models.lists.Meeting1.push({label: "40 min Activity" + i});
        $scope.models.lists.Meeting2.push({label: "60 min Activity" + i});
        $scope.models.lists.Meeting3.push({label: "80 min Activity" + i});
    }
    console.log($scope.models.lists);

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});