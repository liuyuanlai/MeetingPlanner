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
  var index = 0;
  var slideWindowSize = 3;
  var First_M_Pos = 0; // initial the position of the first retrive meeting
  var Max_M_Pos = 0;

  $scope.meeting = [];


  meetings.$loaded(function(){


    // for(var i = 0; i < meetings.length; i++){
    //   $scope.meeting.push(meetings[i]);

    // }
    console.log("test");

    activities.$loaded(function(){
      console.log("test");
      for (var i = 0; i < meetings.length; i++) {
        if (meetings[i].hasOwnProperty("activities")) {
          activities_temp = [];
          for (var j = 0; j < meetings[i].activities.length; j++) {
            for (var k = 0; k < activities.length; k++) {
              if (activities[k].$id == meetings[i].activities[j]) {
                activities_temp.push(activities[k]);
              }
            }
          }
          $scope.models.lists.Activities.push(activities_temp);
          //console.log($scope.models.lists.Activities);
        }else{
          $scope.models.lists.Activities.push([]);
        }
        
      }
    })

    
    // console.log("the num of meetings" + meetings.length);
    if (meetings.length <= 3) {
       for(var i = 0; i < meetings.length; i++){
         $scope.meeting.push(meetings[index + i]);
       }
       Max_M_Pos = 0;
    }else {
      for(var i = 0; i < slideWindowSize; i++){
      $scope.meeting.push(meetings[index + i]);
      }      
       Max_M_Pos = meetings.length - 3;
    };
  })
// end of loaded function


  $scope.models = {
        selected: null,
        lists: {"Activities": []} 
  };



  //   for(var i = 0; i < activities.length; i++){
  //     $scope.models.lists.Activities.push(activities[i]);
  //   }
  // })

  console.log($scope.models);
  
  $scope.Forward = function(){
    First_M_Pos = First_M_Pos + 1;
    if (First_M_Pos > Max_M_Pos) {
       First_M_Pos = Max_M_Pos;
    };

    for(var i = 0; i < slideWindowSize; i++){
      $scope.meeting[i] = meetings[First_M_Pos + i];
    }
  }

  $scope.Back = function(){
    First_M_Pos = First_M_Pos - 1;
    if (First_M_Pos < 0) {
       First_M_Pos = 0;
    };
    
    for(var i = 0; i < slideWindowSize; i++){
      $scope.meeting[i] = meetings[First_M_Pos + i];
    }
  }


  $scope.getActLength = function (id) {

    for (key in activities) {
      // console.log(activities[key].$id);
        if(activities[key].$id == id){

          return activities[key].length;
        };
      }
  }

  $scope.getEndTime = function (index,length,count) {

    if (count == 1) {
      $scope.meeting[index].mLength += length;


    } else if (count ==0){
      $scope.meeting[index].mLength -= length;
      // $scope.meeting[index].mEndTime -= length;
    };

    $scope.meeting[index].mEndTime = $scope.meeting[index].mStartTime + $scope.meeting[index].mLength;
  }


  $scope.insertactivity = function(item, index){
    //console.log(item.$id);
    //console.log(index);
    if (meetings[index].hasOwnProperty("activities")) {

      meetings[index].activities.push(item.$id);
      meetings.$save(index);
      //console.log(meetings);
      //$scope.meeting[index].activities.push(item.$id);
      //console.log($scope.models.lists.Activities);
      //$scope.models.lists.Activities[index].push(item);

    }else{
      meetings[index]["activities"] = [item.$id];
      console.log(meetings);
      meetings.$save(index);
      //$scope.meeting[index]["activities"] = [item.$id];
    }

    for (var i = 0; i < activities.length; i++) {
      if (activities[i].$id == item.$id) {
        activities[i].homeless = false;
        activities.$save(i);
      }
        
    }
    // console.log($scope.models.lists.Activities[index]);
    // console.log(meetings[index].activities);

    $scope.getEndTime(index,item.length,1);


  }

  $scope.dragactivity = function(activityindex, meetingindex){

    var actLength = $scope.getActLength(meetings[meetingindex].activities[activityindex]);
    meetings[meetingindex].activities.splice(activityindex, 1);
    //meetings[meetingindex].activities.$save(activityindex);
    meetings.$save(meetingindex);

    $scope.models.lists.Activities[meetingindex].splice(activityindex,1);

    $scope.getEndTime(meetingindex,actLength,0);

  }



  // Model to JSON for demo purpose
  // $scope.$watch('models', function(model) {
  //     $scope.modelAsJson = angular.toJson(model, true);
  // }, true);


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

  $scope.removeMeeting = function(w_Index){
   // Get the index at the window, then get the actual index in the meeting array
   console.log("first M position" + First_M_Pos);
    meetings.$remove(First_M_Pos + w_Index);
    $scope.meeting.splice(First_M_Pos + w_Index,1);
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;
  }

  // //Show meetinglist test
  // $scope.getMID = function(id){
  //   console.log("hi");
  //   console.log(id);
  // }

    
  //Create Meeting
  $scope.createMeeting = function (name, place, time, tag, members, description){
    var new_meeting = {
      mName: name,
      MPlace: place,
      mTime: time,
      mTag: tag,
      mMembers: members,
      mDescript: description,
      mStartTime: 0,
      mEndTime: 0,
      mLength: 0,

    };

    meetings.$add(new_meeting);
    console.log(meetings);


    $scope.meeting.push(new_meeting);
    $scope.models.lists.Activities.push([]);
    //$scope.models.lists.Activities.push([]);
    // $scope.meeting.push(new_meeting);

    if(meetings.length <= 3) {
       for(var i = 0; i < meetings.length; i++){
         $scope.meeting.push(meetings[index + i]);
       }
       Max_M_Pos = 0;
    }else {
      for(var i = 0; i < slideWindowSize; i++){
      $scope.meeting.push(meetings[index + i]);
      }      
       Max_M_Pos = meetings.length - 3;
    };
   
    $scope.meetinglistshow = true;
    $scope.addmeetingshow = false;
    $scope.editmeetingshow = false;


  }



  $scope.showPercentage = function() {

    $scope.ActivityType = [
    {
            "name" : "Break",
            "type" : "warning",
            "value" : 0,
            "class" : null
        },{
            "name" : "Introduction",
            "type" : "danger",
            "value" : 0
        },{            
          "name" : "Presentation",
          "type" : "info",
            "value" : 0
        },{
          "name" : "Group Work",
          "type" : "success",
            "value" : 0
        }
    ];

    $scope.addActType = function(){
    };

    $scope.addActType();
    $scope.testAct = [];

    var types = ['Break', 'Introduction', 'Presentation', 'Group Work'];
    for (var i = 0; i < 5; i++) {
      var index = Math.floor(Math.random() * 4);
      var actType = $scope.ActivityType;
      $scope.testAct.push({  
                      name: i+6,
                      length: 5*i+1,
                      type: types[index],
                      description: "yeyeye",
                      });

      if ($scope.testAct[i].type == 'Break') {
        $scope.ActivityType[0].value += $scope.testAct[i].length;
      }else if($scope.testAct[i].type == 'Introduction'){
        $scope.ActivityType[1].value += $scope.testAct[i].length;
      }else if($scope.testAct[i].type == 'Presentation'){
        $scope.ActivityType[2].value += $scope.testAct[i].length;
      }else if($scope.testAct[i].type == 'Group Work'){
        $scope.ActivityType[3].value += $scope.testAct[i].length;
      };

    }
    // var breakType = $scope.ActivityType[0];
    // var breakTypeValue = breakType.value;

     if ($scope.ActivityType[0].value < 30) {     
      $scope.ActivityType[0].class = "warningBreak";
     };

  };

  $scope.showPercentage();







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
    var date = data.date, mode = data.mode;
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


