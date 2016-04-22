meetingPlannerApp.controller('ActivitylistCtrl', function ($scope, Ref, Auth, $location, $firebaseAuth, $firebaseArray, $routeParams,User) {


	var activityRef = Ref.child("activities");

		// get the auth info about the current user
	var user_data = Auth.$getAuth();

	var activities = $firebaseArray(activityRef.child(user_data.uid));

	$scope.activitylistshow = true;
	$scope.addactivityshow = false;
	$scope.editactivityshow = false;
	
	$scope.addactivity = function(){
		$scope.activitylistshow = false;
		$scope.editactivityshow = false;
		$scope.addactivityshow = true;	
	}

	$scope.editActivity = function(index){
		$scope.activitylistshow = false;
		$scope.addactivityshow = false;
		$scope.editactivityshow = true;
        
        var editAct = activities[index];
        $scope.eAct = {};
        $scope.eAct.name = editAct.name;
        $scope.eAct.length = editAct.length;
        $scope.eAct.type = editAct.type;
        $scope.eAct.description = editAct.description;
        $scope.index = index;
	}

	$scope.saveChange = function(index){
        $scope.activitylistshow = true;
		$scope.addactivityshow = false;
		$scope.editactivityshow = false;

		activities[index].name = $scope.eAct.name;
		activities[index].length = $scope.eAct.length;
		activities[index].type = $scope.eAct.type;
		activities[index].description = $scope.eAct.description;
		activities.$save(index);
	}

	$scope.removeActivity = function(index){
		// console.log(index);
		activities.$remove(index);
		$scope.models.lists.Activities.splice(index,1);
	}

	$scope.dragactivity = function(index){
		console.log(index);
		//$scope.list.splice($index, 1);
		console.log($scope.models);
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

	
	

    // Generate initial model
    

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    $scope.createActivity = function(){

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
		$scope.editactivityshow = false;
	}



});
  