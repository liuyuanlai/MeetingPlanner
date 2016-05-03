meetingPlannerApp.controller('AddactivityCtrl', 

	function ($scope, Ref, Auth, $location, $firebaseAuth, $firebaseArray, $routeParams) {
		// get path in the firebase
		var activityRef = Ref.child("activities");

		// get the auth info about the current user
		var user_data = Auth.getAuthdata();

		var activities = $firebaseArray(activityRef.child(user_data.uid));

		$scope.testmessage = "hehe";

		$scope.createActivity = function(){
			var newAct = {	name: $scope.newAct_name,
							length: $scope.newAct_length,
							type: $scope.newAct_type,
							description: $scope.newAct_description,
			}
			activities.$add(newAct);
		}

	});

