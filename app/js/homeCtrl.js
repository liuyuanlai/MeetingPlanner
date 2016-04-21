meetingPlannerApp.controller('HomeCtrl',
	 function ($scope, Ref, Auth, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){

		var activityRef = Ref.child("activities");

		var userRef = Ref.child("users");

		var meetingRef = Ref.child("meetings");

		var users = $firebaseArray(userRef);

		// only for testing usage
		$scope.userObject = $firebaseObject(userRef);

		$scope.authWithPassword = function(){
			console.log($scope.signinEmail);
			console.log($scope.signinPassword);

			Auth.$authWithPassword({
				email: $scope.signinEmail,
				password: $scope.signinPassword
			}).then(function(authData){
				console.log("Logged in as: ", authData.uid);
				$location.path("/manage");
			}).catch(function(error) {
				console.log("Authentication failed: ", error);
			})
		}

		$scope.createUser = function(){
			console.log($scope.signupEmail);
			console.log($scope.signupPassword);

			Auth.$createUser({
				email: $scope.signupEmail,
				password: $scope.signupPassword
			}).then(function(userdata) {
				users.$add({email: $scope.signupEmail, password: $scope.signupPassword});
				$scope.message = "user created with uid " + userdata.uid;
				console.log("Signed up as: ", userdata.uid);

				// log in to the system after succeeding signing up
				Auth.$authWithPassword({
					email: $scope.signupEmail,
					password: $scope.signupPassword
				}).then(function(authData){
					console.log("Logged in as: ", authData.uid);
					$location.path("/manage");
				}).catch(function(error){
					console.log("Authentication failed: ", error);
				})
			}).catch(function(error){
				console.log("Failed signing up: ", error);
			});
		};

});