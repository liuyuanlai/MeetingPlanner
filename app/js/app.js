var meetingPlannerApp = angular.module('meetingPlanner', ['firebase','ngRoute','ngResource','ngCookies']);

meetingPlannerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        // this controller is set here only for testing purpose
        controller: 'HomeCtrl'
      }).
      when('/manage', {
        templateUrl: 'partials/manage.html',
        // this controller is set here only for testing purpose
        //controller: 'ManageCtrl'
      }).

      otherwise({
        redirectTo: '/home'
      });
  }]);