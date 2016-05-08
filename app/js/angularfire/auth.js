meetingPlannerApp.factory('Auth', function ($firebase, $q, $firebaseAuth, $resource){

	// get the reference of the function itself
	var th = this;

	// set the root reference of the firebase database
	var rootRef = new Firebase("https://meetingagenda.firebaseio.com");
	// this.rootRef = new Firebase("https://meetingagenda.firebaseio.com");

	this.auth = $firebaseAuth(rootRef);
	var auth = $firebaseAuth(rootRef);

	// variables for user authentication
	// if this.authdata is not null, it means someone has logged in
	// var authdata = null;
	// var authdata = authdata || null;
	var authdata = auth.$getAuth();
	// var autherror = null;


	this.getAuthdata = function() {
		// return authdata;
		return auth.$getAuth();
	}

	this.setAuthdata = function (data) {
		authdata = data;
	}

	// this.getAutherror = function() {
	// 	return autherror;
	// }

	// this.setAutherror = function (error) {
	// 	autherror = error;
	// }

	this.createUser = function (signupEmail, signupPassword) {
		// authdata = null;
		// autherror = null;

		return auth.$createUser({
			email: signupEmail,
			password: signupPassword
		});
	}



	this.authWithPassword = function (signinEmail, signinPassword) {
		// authdata = null;
		// autherror = null;

		return auth.$authWithPassword({
			email: signinEmail,
			password: signinPassword
		});
	}

	this.asyncAuthWithPassword = function (signinEmail, signinPassword) {
		var deferred = $q.defer();
		// run the actual auth codes
		th.authWithPassword(signinEmail, signinPassword);
		
		setTimeout(function() {
			if (th.authdata) {
				deferred.resolve(th.authdata);
			} else {
				// deferred.reject("Invalid auth information!");
				deferred.reject(th.autherror);
			}
		}, 1000);

		return deferred.promise;
	}

	this.logoutUser = function() {
		var authdata = th.getAuthdata();
		console.log("Logged out as: ", authdata.uid);

		auth.$unauth();
	}



	return this;
})