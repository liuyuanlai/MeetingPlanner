meetingPlannerApp.controller('AddactivityCtrl', 

	function ($scope, Ref, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){
	// function ($scope, Ref, $location, $firebaseArray, $routeParams) {
		// get path in the firebase
		var rootRef = Ref.rootRef;
		var activityRef = Ref.rootRef.child("activities");

		var activities = $firebaseArray(activityRef);

		$scope.testmessage = "hehe";

		$scope.createActivity = function(){
			var newAct = {	name: $scope.newAct_name,
							length: $scope.newAct_length,
							type: $scope.newAct_type,
							description: $scope.newAct_description,
			activities.$add(newAct);
		}


	});