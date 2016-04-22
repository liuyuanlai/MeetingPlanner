meetingPlannerApp.controller('ActivitylistCtrl', function ($scope, Ref, Auth, $location, $firebaseAuth, $firebaseArray, $routeParams,User) {


	var activityRef = Ref.child("activities");

		// get the auth info about the current user
	var user_data = Auth.$getAuth();

	var activities = $firebaseArray(activityRef.child(user_data.uid));

	$scope.activitylistshow = true;
	$scope.addactivityshow = false;
	
	$scope.addactivity = function(){
		$scope.activitylistshow = false;
		$scope.addactivityshow = true;	
	}

	$scope.editActivity = function(){
		$scope.activitylistshow = false;
		$scope.addactivityshow = true;
		// console.log("hello edit");
	}

	$scope.removeActivity = function(index){
		// console.log(index);
		activities.$remove(index);
		$scope.models.lists.Activities.splice(index,1);
	}

	$scope.models = {
        selected: null,
        lists: {"Activities": []}
    };

	activities.$loaded(function(){

    	for(var i = 0; i < activities.length; i++){
    		$scope.models.lists.Activities.push(activities[i]);
    	}

	})

	console.log($scope.models);
	

    // Generate initial model
    

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.createActivity = function(){

    	    var index = activities.length;
            var Aid = index + 1;

			var newAct = {	
				            name: $scope.newAct_name,
							length: $scope.newAct_length,
							type: $scope.newAct_type,
							description: $scope.newAct_description,
			}
            
            activities.$add(newAct);
			$scope.models.lists.Activities.push(newAct);
			$scope.activitylistshow = true;
			$scope.addactivityshow = false;
		}

	$scope.createActivitycancel = function(){
		$scope.activitylistshow = true;
		$scope.addactivityshow = false;
	}



});
  