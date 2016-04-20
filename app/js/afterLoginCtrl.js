meetingPlannerApp.controller('AfterLoginCtrl', function ($scope, $routeParams, $firebaseAuth) {

	var ref = new Firebase("https://meetingagenda.firebaseio.com/test");

	var auth = $firebaseAuth(ref);

	$scope.authData = auth.$getAuth();

	if($scope.authData) {
		console.log("Logged in as: ", $scope.authData.uid);
	}
	else{
		console.log("Logged out");
	}


});