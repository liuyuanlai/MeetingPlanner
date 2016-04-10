var meetingPlannerApp = angular.module('meetingPlanner', ['firebase','ngRoute','ngResource']);

meetingPlannerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        // this controller is set here only for testing purpose
        controller: 'HomeCtrl'
      }).
      
      otherwise({
        redirectTo: '/home'
      });
  }]);