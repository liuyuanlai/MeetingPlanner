meetingPlannerApp.controller('HomeCtrl',
	 function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, $routeParams){
		var rootRef = new Firebase("https://meetingagenda.firebaseio.com");

		// testing purpose
		var userRef = rootRef.child("users");
		var meetingRef = rootRef.child("meetings");

		var userArray = $firebaseArray(userRef);
		var meetingObject = $firebaseObject(meetingRef);

		$scope.users = userArray;
		meetingObject.$bindTo($scope, "meeting");

		var auth = $firebaseAuth(rootRef.child("test"));
		$scope.auth = auth;

		$scope.createUser = function(){
			$scope.message = null;
			$scope.error = null;

			auth.$createUser({
				email: $scope.email,
				password: $scope.password
			}).then(function(userdata) {
				$scope.message = "user created with uid " + userdata.uid;
			}).catch(function(error){
				// $scope.error = error;
				$scope.error = error;
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