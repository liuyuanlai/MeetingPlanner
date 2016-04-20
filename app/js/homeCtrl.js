meetingPlannerApp.controller('HomeCtrl',
	 function ($scope, Auth, $location, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){
		// var rootRef = new Firebase("https://meetingagenda.firebaseio.com");
		var rootRef = Auth.rootRef;

		var activityRef = Auth.rootRef.child("activities");

		var userRef = Auth.rootRef.child("users");

		var meetingRef = Auth.rootRef.child("meetings");

		var users = $firebaseArray(userRef);

		// testing message
		// $scope.msg = Ref.rootRef;
		$scope.userObject = $firebaseObject(Auth.rootRef.child("meetings"));

		// testing purpose
		// var userRef = rootRef.child("users");
		// var meetingRef = rootRef.child("meetings");

		var userArray = $firebaseArray(userRef);
		var meetingObject = $firebaseObject(meetingRef);

		$scope.users = userArray;
		meetingObject.$bindTo($scope, "meeting");

		var auth = $firebaseAuth(rootRef.child("test"));
		$scope.auth = auth;

		$scope.authWithPassword = function(){
			console.log($scope.signinEmail);
			console.log($scope.signinPassword);

			auth.$authWithPassword({
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

			auth.$createUser({
				email: $scope.signupEmail,
				password: $scope.signupPassword
			}).then(function(userdata) {
				users.$add({email: $scope.signupEmail, password: $scope.signupPassword});
				$scope.message = "user created with uid " + userdata.uid;
				console.log("Signed up as: ", userdata.uid);
				$location.path("/manage")
			}).catch(function(error){
				// $scope.error = error;
				console.log("Failed signing up: ", error);
			});
		};


		// $scope.users.$add({
		// 	id: 40,
		// 	name: "user3"
		// })
		// $scope.meeting = meetingObject;

		// $scope.userArray.add({"id": 10, "name": "test"});
		// $scope.testData = "hello world";
		// debugger;

		// end of testing codes



		// var user = {
		// 	"id": 1,
		// 	"email": "example@email.com",
		// 	"password": "password",
		// 	"acativities_list": {
		// 		"acativity_id": 1,
		// 		"name": "example",
		// 		"length": 20,
		// 		"type": "break",
		// 		"description": "A normal description"
		// 	},
		// 	"meeting": {
		// 		"meeting_id": 1,
		// 		"meeting_tag": "break",
		// 		"startTime": "08:00",
		// 		"endTime": "11:30",
		// 		"itemLength": {

		// 		}
		// 	},
		// 	"agendaList": {
				
		// 	},
		// }

});