meetingPlannerApp.controller('ForecastCtrl', 
	function ($scope, $http) {
		var callbackFunction = function(data) {
			var wind = data.query.results.channel.wind;
			alert(wind.chill);
		};

		var BASE_API = 'http://query.yahooapis.com/v1/yql';

		var yql_base_api_public = "http://query.yahooapis.com/v1/public/yql";
		var yql_results = "";
		var yql_query = "SELECT * from geo.places WHERE text='stockholm'";

		function handler(rsp) {
			if (rsp.data) {
				yql_results = rsp.data;
				console.log(rsp.data);
			}
		}

		function toQueryString (obj) {
			// var query_string = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='stockholm')";
			var query_string = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + obj + "')";
			
			console.log(query_string);
			return query_string;
		};



		$scope.runQuery = function (query, handler) {
			$http({
				method: 'JSONP',
				url: yql_base_api_public,
				// params: toQueryString({callback: "JSON_CALLBACK", q: query, format: 'json'}),
				params: {format: "json", q: toQueryString(query), callback: "JSON_CALLBACK"},
				// CONTENT_TYPE: 'JSON'
			}).
			then(function(response) {
				console.log("ahaah");
				console.log(response.status);
				console.log(response.data);
				$scope.status = response.status;
				$scope.results = response.data.query.results.channel;
				$scope.forecast = response.data.query.results.channel.item.forecast.slice(0,3);
			}, function(response) {
				console.log("errrrror");
				console.log(response.data || "Request failed");
				console.log(response.status);
				$scope.data = response.data || "Request failed"
				$scope.status = response.status;
			});
		};



	});