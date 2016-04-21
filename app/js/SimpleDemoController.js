meetingPlannerApp.controller('SimpleDemoController', function ($scope) {
	$scope.models = {
        selected: null,
        lists: {"Activities": [], "Meeting1": [], "Meeting2": []}
    };



    // Generate initial model
    for (var i = 1; i <= 3; ++i) {
        $scope.models.lists.Activities.push({label: "20 min Activity" + i});
        $scope.models.lists.Meeting1.push({label: "40 min Activity" + i});
        $scope.models.lists.Meeting2.push({label: "60 min Activity" + i});
        // $scope.models.lists.Meeting3.push({label: "80 min Activity" + i});
    }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);


// test

    // $scope.models = {
    //     selected: null,
    //     lists: [
    //         {
    //         "Name": "1-st",
    //         "Start": 8,
    //         "Length": 90,
    //         "Activities": []     
    //         },
    //         {
    //         "Name": "2-nd", 
    //         "Start": 8,
    //         "Length": 90,
    //         "Activities": []     
    //         },
    //         {
    //         "Name": "3-rd", 
    //         "Start": 8,
    //         "Length": 90,
    //         "Activities": []     
    //         }

    //     ]

    // };

    // console.log($scope.models.lists)
    // var lists1 = $scope.models.lists[0];
    // var lists2 = $scope.models.lists[1];
    // console.log(lists1);
    
    // for (var i = 1; i <= 3; ++i) {

    //     list1.push({label: "20 min Activity" + i});
    //     list2.push({label: "40 min Activity" + i});
    // }

    // // Generate initial model
    // for (var i = 1; i <= 3; ++i) {
    //     $scope.models.lists.Activities.push({label: "20 min Activity" + i});
    //     // $scope.models.lists.Meeting1.push({label: "40 min Activity" + i});
    //     // $scope.models.lists.Meeting2.push({label: "60 min Activity" + i});
    //     // $scope.models.lists.Meeting3.push({label: "80 min Activity" + i});
    // }

    // Model to JSON for demo purpose
    // $scope.$watch('models', function(model) {
    //     $scope.modelAsJson = angular.toJson(model, true);
    // }, true);





});