meetingPlannerApp.controller('MeetinglistCtrl', function ($scope, Ref, Auth, $firebaseArray, $routeParams) {
  $scope.meetinglistshow = true;
  $scope.addmeetingshow = false;
  $scope.editmeetingshow = false;

  // get the auth infomation about the current user
  var user_data = Auth.getAuthdata();

  var meetingRef = Ref.child("meetings");
  var meetings = $firebaseArray(meetingRef.child(user_data.uid));

  var activityRef = Ref.child("activities");
  var activities = $firebaseArray(activityRef.child(user_data.uid));

  // var index = 0;
  // var slideWindowSize = 3;
  // var First_M_Pos = 0; // initial the position of the first retrive meeting
  // var Max_M_Pos = 0;
  //var meetingLength = 0;
  //var slideLength = 0;
  var offSet = 0;
  $scope.meetingShow = [];

  $scope.meeting = [];


  meetings.$loaded(function(){



    activities.$loaded(function(){

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

        }else{
          $scope.models.lists.Activities.push([]);
        }
        
      }
    })

    // meetingLength = meetings.length;
    //slideLength = Math.min(meetingLength, 3);

    for(var i = 0; i < meetings.length; i++){
      $scope.meeting.push(meetings[i]);
      $scope.meeting[i].mLength = $scope.getMeetingLength(i);

      $scope.meeting[i].mEndTime = $scope.getEndTime($scope.meeting[i].mTime, $scope.meeting[i].mLength);
      $scope.showPercentage(i);

    }

    
    if (meetings.length <= 3) {
      for (var i = 0; i < meetings.length; i++) {
        $scope.meetingShow.push(true);
        document.getElementById("forwardBtn").disabled=true;
        $scope.forwardBtn = "BtnDisabled";
      }
    }else{
      for (var i = 0; i < 3; i++) {
        $scope.meetingShow.push(true);
      }
      for (var i = 3; i < meetings.length; i++) {
        $scope.meetingShow.push(false);
      }
      document.getElementById("forwardBtn").disabled=false;
      $scope.forwardBtn = "null";
    }



    
    // console.log("the num of meetings" + meetings.length);
    // if (meetings.length <= 3) {
    //    for(var i = 0; i < meetings.length; i++){
    //      $scope.meeting.push(meetings[index + i]);
    //    }
    //    Max_M_Pos = 0;
    // }else {
    //   for(var i = 0; i < slideWindowSize; i++){
    //   $scope.meeting.push(meetings[index + i]);
    //   }      
    //    Max_M_Pos = meetings.length - 3;
    // };
  })
// end of loaded function


  $scope.models = {
        selected: null,
        lists: {"Activities": []} 
  };


  

  $scope.backBtn = "BtnDisabled";

  // document.getElementById("backBtn").disabled=true;          

  $scope.Forward = function(){

    if (offSet + 3 >= meetings.length) {
      return;
    }else{
      offSet = offSet + 1;
      $scope.meetingShow.splice(0, 0, $scope.meetingShow.pop());

      $scope.backBtn = "null";
      document.getElementById("backBtn").disabled=false;
      if (offSet + 3 >= meetings.length) {
        $scope.forwardBtn = "BtnDisabled";
        document.getElementById("forwardBtn").disabled=true;

      };
     // console.log($scope.meetingShow);
    }
  }

  $scope.Back = function(){
    if (offSet == 0) {
      return ;
    }else{
      offSet = offSet - 1;
      $scope.meetingShow.push($scope.meetingShow.shift());

      $scope.forwardBtn = "null";
      document.getElementById("forwardBtn").disabled=false;
      if (offSet == 0) {
          $scope.backBtn = "BtnDisabled";
          document.getElementById("backBtn").disabled=true;

      };
     // console.log($scope.meetingShow);
    }
  }


  $scope.getActLength = function (id) {

    for (var key in activities) {
      // console.log(activities[key].$id);
        if(activities[key].$id == id){

          return activities[key].length;
        };
      }

  }


  $scope.getMeetingLength = function (index) {
    var actlist = meetings[index].activities;
    var meetL = 0;
    
    for (var key in actlist) {
      meetL += $scope.getActLength(actlist[key]);

    };

    return meetL;
  }

  $scope.getEndTime = function(startTime, length){
    var hour = startTime.slice(0, 2);
    var minute = startTime.slice(3, 5);
    var newMinute = (parseInt(minute) + parseInt(length)) % 60;
    var carry = Math.floor((parseInt(minute) + parseInt(length))/60);
    var newHour = (parseInt(hour) + carry) % 24;
    var endMinute = newMinute.toString();
    var endHour = newHour.toString();
    if (newMinute < 10) {
      endMinute = "0" + endMinute;
    }
    if (newHour < 10) {
      endHour = "0" + endHour;
    }
    return endHour + ":" + endMinute;
  }
  



  $scope.insertactivity = function(item, meetingindex, activityindex){

    if (meetings[meetingindex].hasOwnProperty("activities")) {

      meetings[meetingindex].activities.splice(activityindex, 0, item.$id);
      meetings.$save(meetingindex);
      //console.log(meetings);
      //$scope.meeting[index].activities.push(item.$id);
      //console.log($scope.models.lists.Activities);
      //$scope.models.lists.Activities[index].push(item);

    }else{
      meetings[meetingindex]["activities"] = [item.$id];
     // console.log(meetings);
      meetings.$save(meetingindex);
      //$scope.meeting[meetingindex]["activities"] = [item.$id];
    }

    for (var i = 0; i < activities.length; i++) {
      if (activities[i].$id == item.$id) {
        activities[i].homeless = false;
        activities.$save(i);
      }
        
    }

    var meetL = $scope.getMeetingLength(meetingindex);
    $scope.meeting[meetingindex].mLength = meetL;

    $scope.meeting[meetingindex].mEndTime = $scope.getEndTime($scope.meeting[meetingindex].mTime, meetL);
    $scope.showPercentage(meetingindex);




  }

  $scope.dragactivity = function(activityindex, meetingindex){


    meetings[meetingindex].activities.splice(activityindex, 1);
    //meetings[meetingindex].activities.$save(activityindex);
    meetings.$save(meetingindex);

    $scope.models.lists.Activities[meetingindex].splice(activityindex,1);

    

    var meetL = $scope.getMeetingLength(meetingindex);
    $scope.meeting[meetingindex].mLength = meetL;
    $scope.meeting[meetingindex].mEndTime = $scope.getEndTime($scope.meeting[meetingindex].mTime, meetL);
    $scope.showPercentage(meetingindex);



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
    $scope.eMeeting.date = new Date(editMeeting.mDate);
   // console.log($scope.eMeeting.date);

    // var dt = editMeeting.mDateTime;
    // var date = new Date(dt);    
    // $scope.eMeeting.mtime = new Date(date);

    // $scope.eMeeting.mtime = new Date();
    $scope.eMeeting.mtime = new Date(editMeeting.mDateTime);
    
    $scope.eMeeting.tag = editMeeting.mTag;
    $scope.eMeeting.members = editMeeting.mMembers;
    $scope.eMeeting.descript = editMeeting.mDescript;
    $scope.eMindex = index;
  }

  $scope.saveEditM = function(index){

   var dt = $scope.eMeeting.date;
   var mytime = $scope.eMeeting.mtime;
   var date = dt.getDate();
   var year = dt.getFullYear();
   var month = dt.getMonth();
   var hours = mytime.getHours();
   var min = mytime.getMinutes();

   var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var m = month[dt.getMonth()];
    // var M_date = date + "-" + m + "-" + year;
    var M_date = m + " " + date + ", " + year;

    // Set the start time
    var M_hours = mytime.getHours();
    var M_min = mytime.getMinutes();

    if (hours < 10) {
        M_hours = "0" + hours;
    };
    if (min < 10) {
        M_min = "0" + min;
    };
    
    var M_time = M_hours + ':' + M_min;

    var M_DateTime = M_date + " " + M_time;
    
    //console.log(M_DateTime);
 
    if ($scope.eMeeting.mName == null || $scope.eMeeting.mName == "") {
      $scope.alertM = "Meeting name is required";
    } else if ($scope.eMeeting.place == null || $scope.eMeeting.place =="") {
      $scope.alertP = "Meeting location is required";
    } else{
      
      meetings[index].mName = $scope.eMeeting.mName;
      meetings[index].MPlace = $scope.eMeeting.place;
      meetings[index].mDateTime = M_DateTime;
      meetings[index].mDate = M_date;
      meetings[index].mTime = M_time;
      meetings[index].mEndTime = $scope.getEndTime($scope.meeting[index].mTime, $scope.getMeetingLength(index));
      
      if ($scope.eMeeting.tag == null) {
        meetings[index].mTag == "";
      } else{
        meetings[index].mTag = $scope.eMeeting.tag;
      };

      if ($scope.eMeeting.members == null) {
        meetings[index].mMembers = "";
      } else{
        meetings[index].mMembers = $scope.eMeeting.members;
      };

      if ($scope.eMeeting.descript == null) {
        meetings[index].mDescript = "";
      } else{
        meetings[index].mDescript = $scope.eMeeting.descript;
      };
      
      // meetings[index].mTag = $scope.eMeeting.tag;
      // meetings[index].mMembers = $scope.eMeeting.members;
      // meetings[index].mDescript = $scope.eMeeting.descript;
      
      meetings.$save(index);

      alert("you have successfully saved meeting");
      $scope.alertP = "";
      $scope.alertM = "";

      $scope.meetinglistshow = true;
      $scope.addmeetingshow = false;
      $scope.editmeetingshow = false;


    };
    
    
   

  }

  $scope.removeMeeting = function(index){
   // Get the index at the window, then get the actual index in the meeting array
    var confirmRM = confirm ("Are You Sure To Delete this Meeting");
    if (confirmRM == true) {
          meetings.$remove(index);
          $scope.models.lists.Activities.splice(index, 1);
          $scope.meeting.splice(index, 1);
          console.log($scope.meetingShow);
          var flag = true;
          if (index + 1 < $scope.meetingShow.length) {
            for (var i = index + 1; i < $scope.meetingShow.length; i++) {
              if ($scope.meetingShow[i] == false) {
                $scope.meetingShow[i] = true;
                flag = false;

                if (i + 1 < $scope.meetingShow.length) {
                    document.getElementById("forwardBtn").disabled=false;
                    $scope.forwardBtn = "null";
                }else{
                    document.getElementById("forwardBtn").disabled=true;
                    $scope.forwardBtn = "BtnDisabled";
                };

                break;
              }
            }
            if (flag && index > 0) {
              for (var i = index - 1; i >= 0; i--) {
                if ($scope.meetingShow[i] == false) {
                $scope.meetingShow[i] = true;
                flag = false;
                if (offSet > 0) {
                  offSet = offSet -1;

                  if (offSet == 0) {
                    document.getElementById("backBtn").disabled=true;
                    $scope.backBtn = "BtnDisabled";
                  }else{
                    document.getElementById("backBtn").disabled=false;
                    $scope.backBtn = "null";
                  };
                }
                break;
                }
              }
            }
          }else if (index > 0) {
            for (var i = index - 1; i >= 0; i--) {
                if ($scope.meetingShow[i] == false) {
                $scope.meetingShow[i] = true;
                flag = false;
                if (offSet > 0) {
                  offSet = offSet -1;

                  if (offSet == 0) {
                    document.getElementById("backBtn").disabled=true;
                    $scope.backBtn = "BtnDisabled";
                  }else{
                    document.getElementById("backBtn").disabled=false;
                    $scope.backBtn = "null";
                  };
                }
                break;
                }
            }
          }
          $scope.meetingShow.splice(index, 1);
    }else{
      return;
    };

  }


  $scope.isCollapsed = false;

  $detailInfo = false;



  //Create Meeting
  $scope.createMeeting = function (name, place, dt, mytime, tag, members, description){
    if (name == null || name == "") {
      $scope.alertM = "Meeting name is required";
    }else if (place == null || place == "") {
      $scope.alertP = "Meeting location is required";
    }
    if (tag == null) {
      tag = "";
    };
    if (members == null) {
      members = "";
    };
    if (description == null) {
      description = "";
    };

   var date = dt.getDate();
   var year = dt.getFullYear();
   var month = dt.getMonth();
   var hours = mytime.getHours();
   var min = mytime.getMinutes();

   if (date == null) {
    $scope.dt = "";
    $scope.alertD = "Please verify the date"
   };

   var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var m = month[dt.getMonth()];
    // var M_date = date + "-" + m + "-" + year;
    var M_date = m + " " + date + ", " + year;

    // Set the start time
    var M_hours = mytime.getHours();
    var M_min = mytime.getMinutes();

    if (hours < 10) {
        M_hours = "0" + hours;
    };
    if (min < 10) {
        M_min = "0" + min;
    };
    
    var M_time = M_hours + ':' + M_min;

    var M_DateTime = M_date + " " + M_time;

    // if ( (name != "" || name != null) && (location != "" || location != null))

    if ( name != null && place != null) {
      var new_meeting = {
      mName: name,
      MPlace: place,
      mDateTime: M_DateTime,
      mDate: M_date,
      mTime: M_time,
      mTag: tag,
      mMembers: members,
      mDescript: description,
      mStartTime: 0,
      mEndTime: M_time,
      mLength: 0,
     };
      //console.log("success");
      meetings.$add(new_meeting).then(function(){
        //console.log("test");
      });
      alert("you have successfully created the meeting");

      $scope.meetingShow.push(true);

      if ($scope.meetingShow.length > 3) {
        $scope.meetingShow[$scope.meetingShow.length - 2] = true;
        $scope.meetingShow[$scope.meetingShow.length - 3] = true;
        for (var i = 0; i < $scope.meetingShow.length -3; i++) {
          $scope.meetingShow[i] = false;
          offSet = $scope.meetingShow.length - 3;
        }
        document.getElementById("backBtn").disabled=false;
        $scope.backBtn = "null";
        document.getElementById("forwardBtn").disabled=true;
        $scope.forwardBtn = "BtnDisabled";
      }

      $scope.meeting.push(new_meeting);
      $scope.models.lists.Activities.push([]);
      $scope.meetinglistshow = true;
      $scope.addmeetingshow = false;
      $scope.editmeetingshow = false;

      $scope.mName = "";
      $scope.MPlace = "";
      $scope.tags = "";
      $scope.Mmembers = "";
      $scope.Mdescript = "";
      $scope.alertP = "";
      $scope.alertM = "";

    };
  }

  $scope.addActType = function(index,type){

    var actlist = meetings[index].activities;
    var typeLength = 0;
    // console.log(actlist);
    for (var key in actlist) { 


      for(var keyType in activities){

        if(activities[keyType].$id == actlist[key]){

          if (activities[keyType].type == type) {

            typeLength += activities[keyType].length; 
          };


        }
      }

    };
    // console.log("typeLength:"+ type + typeLength);
    return typeLength;

  };




  $scope.actType = [];
  
  $scope.showPercentage = function(index) {

    // console.log("showPercentage");
    $scope.ActivityType = [
      {
              "name" : "Break",
              "type" : "warning",
              "value" : 0,
              "class" : null
          },{
              "name" : "Discussion",
              "type" : "success",
              "value" : 0
          },{            
              "name" : "Presentation",
              "type" : "info",
              "value" : 0
          },{
              "name" : "GroupWork",
              "type" : "danger",
              "value" : 0
          }
      ];
    
    
    var totalLength = $scope.getMeetingLength(index);
    //console.log(totalLength);
    if (totalLength != 0) {
        $scope.ActivityType[0].value = Math.round($scope.addActType(index,"break")/totalLength*100);
        $scope.ActivityType[1].value = Math.round($scope.addActType(index,"discussion")/totalLength*100);
        $scope.ActivityType[2].value = Math.round($scope.addActType(index,"presentation")/totalLength*100);
        $scope.ActivityType[3].value = Math.round($scope.addActType(index,"group-work")/totalLength*100);
 
    };


    // $scope.actType.push($scope.ActivityType);
    $scope.actType[index] = $scope.ActivityType;
    
    
     if ($scope.actType[index][0].value < 30) {     
      $scope.actType[index][0].class = "warningBreak";
     };

  };

  // $scope.showPercentage();







  $scope.removeActivity = function(meetingindex, activityindex){

    var id = meetings[meetingindex].activities[activityindex].$id;
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].$id == id) {
        activities.$remove(i);
      }
    }
    
    meetings[meetingindex].activities.splice(activityindex, 1);
    //meetings[meetingindex].activities.$save(activityindex);
    meetings.$save(meetingindex);

    $scope.models.lists.Activities[meetingindex].splice(activityindex,1);

    var meetL = $scope.getMeetingLength(meetingindex);
    $scope.meeting[meetingindex].mLength = meetL;
    $scope.meeting[meetingindex].mEndTime = $scope.getEndTime($scope.meeting[meetingindex].mTime, meetL);
    $scope.showPercentage(meetingindex);

  }


  $scope.addmeeting = function(){
    $scope.meetinglistshow = false;
    $scope.addmeetingshow = true;
    $scope.editmeetingshow = false;

    this.mName = "";
    this.MPlace = "";
    this.tags = [];
    this.Mmembers = [];
    this.Mdescript = [];
    this.dt = new Date();
    this.mytime = new Date();

    
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

  $scope.ismeridian = false;
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
    // $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };


});


