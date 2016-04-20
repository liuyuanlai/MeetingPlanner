meetingPlannerApp.controller('MeetinglistCtrl', function ($scope,$routeParams,User) {


});

meetingPlannerApp.controller('ProgressDemoCtrl', function ($scope,$routeParams) {
$scope.max = 200;

  $scope.random = function() {
    var value = 35;
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = type === 'danger' || type === 'warning';

    $scope.dynamic = value;
    $scope.type = type;
  };

  $scope.random();



  $scope.showPercentage = function() {
    $scope.Activity = [
    {
            "name" : "Break",
            "type" : "warning",
            "value" : 24
        },{
            "name" : "Introduction",
            "type" : "danger",
            "value" : 25
        },{            
        	"name" : "Presentation",
        	"type" : "info",
            "value" : 20
        },{
        	"name" : "Group Work",
        	"type" : "success",
            "value" : 30
        }
    ];
    // var types = ['success', 'info', 'warning', 'danger'];   
     var breakType = $scope.Activity[0];
     var breakTypeValue = breakType.value;

     if (breakTypeValue < 30) {

     };

  };

  $scope.showPercentage();


});
