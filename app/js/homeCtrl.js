meetingPlannerApp.controller('HomeCtrl',
	 function ($scope, Ref, Auth, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){

		var activityRef = Ref.child("activities");

		var userRef = Ref.child("users");

		var meetingRef = Ref.child("meetings");

		var users = $firebaseArray(userRef);
		

		$scope.userUsername = "John Doe";

		Auth.$onAuth(function(authdata) {
			if(authdata) {
				var userKey = authdata.uid;
				var test = $firebaseObject(userRef.child(userKey)) 
				var currentUser = $firebaseObject(userRef.child(userKey));
				currentUser.$loaded()
					.then(function(data){
						$scope.userUsername = data.username;
					})
					.catch(function(error) {
						console.log("Error: ", error);
					});
				console.log($firebaseObject(userRef.child(userKey)));
				console.log("haha");
			} else {
				console.log("Logged out");
			}
		});



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
				var userObj = $firebaseObject(userRef.child(userdata.uid));
				userObj.email = $scope.signupEmail;
				userObj.username = $scope.signupUsername;
				userObj.password = $scope.signupPassword;

				userObj.$save();

				// users.$add({email: $scope.signupEmail, password: $scope.signupPassword});
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


		$scope.logoutUser = function() {
			Auth.$unauth();
			$location.path("/home");
		}

});