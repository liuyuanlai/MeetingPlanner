meetingPlannerApp.factory('Forecast', 
	function ($resource, $http) {

		var BASE_API = 'http://query.yahooapis.com/v1/yql';

		var yql_base_api_public = "http://query.yahooapis.com/v1/public/yql";
		var yql_results = "";
		var yql_query = "SELECT * from geo.places WHERE text='stockholm'";

		this.forecast = null;
		var th = this;

		function toQueryString (obj) {
			var query_string = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + obj + "')";
			return query_string;
		};



		this.runQuery = function (query) {
			th.forecast = null;
			$http({
				method: 'JSONP',
				url: yql_base_api_public,
				params: {format: "json", q: toQueryString(query), callback: "JSON_CALLBACK"},
			}).
			then(function(response) {
				if (response.data.query.results) {
					var result = response.data.query.results.channel.item.forecast.slice(0,3);
					th.forecast = result;
					return result;
				} else {
					th.forecast = null;
					return null;
				}
			}, function(response) {
				th.forecast = null;
				return null;	
			});
		};

		return this;

	});