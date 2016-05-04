meetingPlannerApp.controller('ForecastCtrl', 
	function ($scope, $q, Forecast) {

		$scope.forecast = null;

		var asyncQuery = function (query) {
			return $q(function (resolve, reject) {
				Forecast.runQuery(query);
				setTimeout(function() {
					if(Forecast.forecast) {
						resolve(Forecast.forecast);
					} else {
						reject("Please enter a valid place!");
					}
				}, 1000);
			});
		}

		$scope.runQuery = function(query) {
			$scope.forecast = null;
			$scope.error = null;
			var promise = asyncQuery(query);
			promise.then(function(result) {
				$scope.forecast = result;
			}, function(error) {
				$scope.error = error;
			});
		}

	})