meetingPlannerApp.controller('MeetinglistCtrl', function ($scope, Ref, Auth, $firebaseArray, $routeParams,User) {
  $scope.meetinglistshow = true;
  $scope.addmeetingshow = false;
  $scope.editmeetingshow = false;

  // get the auth infomation about the current user
  var user_data = Auth.$getAuth();


  var meetingRef = Ref.child("meetings");
  var meetings = $firebaseArray(meetingRef.child(user_data.uid));

  var activityRef = Ref.child("activities");
  var activities = $firebaseArray(activityRef.child(user_data.uid));

  $scope.meeting = [];

  meetings.$loaded(function(){

    for(var i = 0; i < meetings.length; i++){
      $scope.meeting.push(meetings[i]);
    }

  })

  $scope.models = {
        selected: null,
        lists: {"Activities": []}
    };
    
  activities.$loaded(function(){

      for(var i = 0; i < activities.length; i++){
        $scope.models.lists.Activities.push(activities[i]);
      }
  })
  
  
  $scope.editMeeting = function(index){
    $scope.meetinglistshow = false;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = true;
    
    var editMeeting = meetings[index];
    $scope.eMeeting = {};
    $scope.eMeeting.mName = editMeeting.mName;
    $scope.eMeeting.place = editMeeting.MPlace;
    // $scope.eMeeting.mTime = editMeeting.mTime;
    $scope.eMeeting.tag = editMeeting.mTag;
    $scope.eMeeting.members = editMeeting.mMembers;
    $scope.eMeeting.descript = editMeeting.mDescript;
    $scope.eMindex = index;
  }

  $scope.saveEditM = function(index){
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;
    
    meetings[index].mName = $scope.eMeeting.mName;
    meetings[index].MPlace = $scope.eMeeting.place;
    meetings[index].mTime = $scope.dt;
    meetings[index].mTag = $scope.eMeeting.tag;
    meetings[index].mMembers = $scope.eMeeting.members;
    meetings[index].mDescript = $scope.eMeeting.descript;
    meetings.$save(index);
    console.log(meetings[index]);
  }

  $scope.removeMeeting = function(index){
    meetings.$remove(index);
    $scope.meeting.splice(index,1);
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;
  }

  //Show meetinglist test
    
  //Create Meeting
  $scope.createMeeting = function (name, place, time, tag, members, description){
    var new_meeting = {
      mName: name,
      MPlace: place,
      mTime: time,
      mTag: tag,
      mMembers: members,
      mDescript: description
    };

    meetings.$add(new_meeting);
    // $scope.models.lists.Activities.push(newAct);

    $scope.meeting.push(new_meeting);
    // $scope.meeting.push(new_meeting);
   
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;

  }


  $scope.removeActivity = function(index){
    activities.$remove(index);
    $scope.models.lists.Activities.splice(index,1);
  }


  $scope.addmeeting = function(){
    $scope.meetinglistshow = false;
    $scope.addmeetingshow = true;
    $scope.editmeetingshow = false;
  }

  $scope.goback = function(){
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;
  }

  // Date Picker
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    // var date = data.date,
    //   mode = data.mode;
    // return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
//Date Picker

// Time Picker
$scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.options = {
    hstep: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 00],
    mstep: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 00]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };


});







meetingPlannerApp.controller('ProgressDemoCtrl', function ($scope,$routeParams) {


  $scope.max = 200;

  $scope.random = function() {
    var value = 35;
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = type === 'danger' || type === 'warning';

    $scope.dynamic = value;
    $scope.type = type;
  };

  $scope.random();



  $scope.showPercentage = function() {
    $scope.Activity = [
    {
            "name" : "Break",
            "type" : "warning",
            "value" : 24,
            "class" : null
        },{
            "name" : "Introduction",
            "type" : "danger",
            "value" : 25
        },{            
        	"name" : "Presentation",
        	"type" : "info",
            "value" : 20
        },{
        	"name" : "Group Work",
        	"type" : "success",
            "value" : 30
        }
    ];
    // var types = ['success', 'info', 'warning', 'danger'];   
     var breakType = $scope.Activity[0];
     var breakTypeValue = breakType.value;

     if (breakTypeValue < 30) {
      
      $scope.Activity[0].class = "warningBreak";


     };

  };

  $scope.showPercentage();



});
