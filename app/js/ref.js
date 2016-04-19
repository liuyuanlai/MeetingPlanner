meetingPlannerApp.factory('Ref', function ($resource){
	// var rootRef = new Firebase("https://meetingagenda.firebaseio.com");

	this.rootRef = new Firebase("https://meetingagenda.firebaseio.com");

	// this.userRef = rootRef.child("users");

	// this.activityRef = rootRef.child("activities");

	return this;
})