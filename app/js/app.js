var meetingPlannerApp = angular.module('meetingPlanner', ['firebase','ngRoute','ngResource','ngCookies','ui.bootstrap','ngTagsInput','dndLists']);

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
        controller: 'HomeCtrl'
        // this controller is set here only for testing purpose
        //controller: 'ManageCtrl'
      }).
      when('/afterLogin', {
        templateUrl: 'partials/afterLogin.html',
        controller: 'AfterLoginCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);