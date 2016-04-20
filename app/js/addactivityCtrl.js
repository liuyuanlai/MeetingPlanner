meetingPlannerApp.controller('AddactivityCtrl', 

	// function ($scope, Ref, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){
	function ($scope, Auth, $location, $firebaseAuth, $firebaseArray, $routeParams) {
		// get path in the firebase
		var rootRef = Auth.rootRef;
		var activityRef = Auth.rootRef.child("activities");

		// get the auth info about the current user
		var user_auth = rootRef.getAuth();

		var activities = $firebaseArray(activityRef.child(user_auth.uid));
		// var activities = $firebaseArray(activityRef);

		$scope.testmessage = "hehe";

		$scope.createActivity = function(){
			var newAct = {	name: $scope.newAct_name,
							length: $scope.newAct_length,
							type: $scope.newAct_type,
							description: $scope.newAct_description,
			// activities.$add(newAct);
			}
			activities.$add(newAct);
		}

	});

