meetingPlannerApp.factory('Auth', function ($firebase, $firebaseAuth, $resource){

	// set the root reference of the firebase database
	// var rootRef = new Firebase("https://meetingagenda.firebaseio.com");
	this.rootRef = new Firebase("https://meetingagenda.firebaseio.com");
	// this.rootRef = rootRef;

	// this.auth = $firebaseAuth(rootRef);

	return $firebaseAuth(this.rootRef);
})