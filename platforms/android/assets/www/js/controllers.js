var pathBase = "http://localhost/smartLock/sevices";

angular.module('starter.controllers', ['ngCordova'])
.controller('mainCtrl', function($scope, $interval) {
  $interval(function() {
    alert("send gps location");
  }, 30000);
})

.controller('statusCtrl', function($scope, $state, $cordovaGeolocation, Position) {
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });     
     
      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      }); 

      google.maps.event.addListenerOnce($scope.map, 'click', function(){
        console.log("disableclicks");
      });


    });

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('configCtrl', function($scope, $ionicPlatform) {
  
  $scope.a = function(){
    console.log('aaaa');
  }

  $scope.print = function(){
    console.log($scope.programada.time);
  }

  $scope.close = function(){
    serial.write('1', function(){
      alert('Sucess!');
    }, function(){
      alert('Error!');
    });
  };
})

.controller('historyCtrl', function($scope) {
  var a = 1;
});