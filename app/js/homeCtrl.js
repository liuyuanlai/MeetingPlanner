meetingPlannerApp.controller('HomeCtrl',
	 function ($scope, $q, Ref, Auth, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){

		var activityRef = Ref.child("activities");

		var userRef = Ref.child("users");

		var meetingRef = Ref.child("meetings");

		var users = $firebaseArray(userRef);
		

		$scope.userUsername = "John Doe";

		// initialize the error message content
		$scope.signinError = "";
		$scope.signupError = "";

		var initializeUsername = function() {
			if(Auth.getAuthdata()) {
				var currentUser = $firebaseObject(userRef.child(Auth.getAuthdata().uid));
				currentUser.$loaded()
					.then(function(data){
						$scope.userUsername = data.username;
					})
					.catch(function(error) {
						$scope.error = error;
						console.log("Error: ", error);
					});
			}
		}

		initializeUsername();


		$scope.authWithPassword = function() {
			var promise = Auth.authWithPassword($scope.signinEmail, $scope.signinPassword);

			promise.then(function(authdata) {
				console.log("Logged in as: ", authdata.uid);
				// Auth.authdata = authdata;
				Auth.setAuthdata(authdata);
				$scope.uid = authdata.uid;
				$location.path("/manage");
			}).catch(function(error) {
				console.log("Authentication failed: ", error);
				console.log(error);
				$scope.signinError = error;
			});
		}

		$scope.createUser = function() {
			var promise = Auth.createUser($scope.signupEmail, $scope.signupPassword);
			
			promise.then(function(userdata) {
				var userObj = $firebaseObject(userRef.child(userdata.uid));
				userObj.email = $scope.signupEmail;
				userObj.username = $scope.signupUsername;
				userObj.password = $scope.signupPassword;

				userObj.$save();

				return Auth.authWithPassword(userObj.email, userObj.password);
			}).then(function(authdata) {
				console.log("Logged in as: ", authdata.uid);
				$location.path("/manage");
			}).catch(function(error) {
				$scope.signupError = error;
				console.log("Failed to create new user: ", error);
			})
		}



		$scope.logoutUser = function() {
			Auth.logoutUser();
			$location.path("/home");
		}

});