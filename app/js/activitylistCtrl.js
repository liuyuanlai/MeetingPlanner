meetingPlannerApp.controller('ActivitylistCtrl', function ($scope, Ref, Auth, $location, $firebaseAuth, $firebaseArray, $routeParams) {

	var activityRef = Ref.child("activities");

	// get the auth info about the current user
	var user_data = Auth.getAuthdata();

	var activities = $firebaseArray(activityRef.child(user_data.uid));

	activities.$loaded(function(){

    	for(var i = 0; i < activities.length; i++){
    		if (activities[i].homeless == true) {
    			$scope.models.lists.Activities.push(activities[i]);
    		}
    		
    	}

	});


	// only for printing out the array data from firebas

	$scope.activitylistshow = true;
	$scope.addactivityshow = false;
	$scope.editactivityshow = false;
	
	$scope.addactivity = function(){
		$scope.newAct_name = "";
		$scope.newAct_length = "";
		$scope.newAct_type = "presentation";
		$scope.newAct_description = "";
		$scope.activitylistshow = false;
		$scope.editactivityshow = false;
		$scope.addactivityshow = true;	
	}

	var getTrueIndex = function(key){
		// var count = 0;
		// for (var i = 0; i < activities.length; i++) {
		// 	if (activities[i].homeless == true) {
		// 		count = count + 1;
		// 	}
		// 	if (count == (index + 1)) {
		// 		return i;
		// 	}
		// }
		var id = $scope.models.lists.Activities[key].$id;
		for (var i = 0; i < activities.length; i++) {
	      if (activities[i].$id == id) {
	        return i;
	      }
	    }

	}

	$scope.editActivity = function(key){
		// var id = $scope.models.lists.Activities[key].$id;
		// for (var i = 0; i < activities.length; i++) {
	 //      if (activities[i].$id == id) {
	 //        var index = i;
	 //      }
	 //    }
		var index = getTrueIndex(key);
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

	

	$scope.removeActivity = function(key){
		var index = getTrueIndex(key);
		activities.$remove(index);
		$scope.models.lists.Activities.splice(key,1);
	}

	$scope.saveChange = function(index){
		//var index = getTrueIndex(key);
        

		activities[index].name = $scope.eAct.name;
		activities[index].length = $scope.eAct.length;
		activities[index].type = $scope.eAct.type;
		activities[index].description = $scope.eAct.description;
		activities.$save(index);
		$scope.activitylistshow = true;
		$scope.addactivityshow = false;
		$scope.editactivityshow = false;
	}

	

	

	$scope.dragactivity = function(index){
		//console.log(index);
		//activities[index].homeless = false;
		//activities.$save(index);
		//console.log(activities);
		//$scope.models.lists.Activities[index].homeless = false;
		$scope.models.lists.Activities.splice(index, 1);
		//$scope.list.splice($index, 1);
		//console.log($scope.models);
	}

	$scope.insertactivity = function(item, index){
		//console.log($scope.models.lists.Activities);
		//console.log(index);
		//var index = getTrueIndex(key);
		var key;
		for (var i = activities.length - 1; i >= 0; i--) {
			if(activities[i].$id == item.$id){
				key = i;
				activities[i].homeless = true;
				activities.$save(i);
				break;
				//$scope.models.lists.Activities[i].homeless = true;


			}
		}

	}

	$scope.models = {
        selected: null,
        lists: {"Activities": []}
    };


	

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
							homeless: true,
			}

			console.log(newAct);
            
            activities.$add(newAct);
            activities.$loaded(function(){
            	$scope.models.lists.Activities.push(activities[activities.length-1]);
            })
            //console.log(activities);
			//
			$scope.activitylistshow = true;
			$scope.addactivityshow = false;
	}

	$scope.createActivitycancel = function(){
		$scope.activitylistshow = true;
		$scope.addactivityshow = false;
		$scope.editactivityshow = false;
	}


   $scope.isCollapsed = false;


});
  