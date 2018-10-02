var pathBase = "http://localhost/smartLock/sevices";

angular.module('starter.controllers', ['ngCordova'])
.controller('mainCtrl', function($scope, $ionicPlatform, $state, $interval, $cordovaGeolocation, $socket) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  //Sobreescreve o funcionamento padrão do botão de retornar no Android;
  //Retorna sempre para a tela inicial, ao menos que esteja no estado 'app.alimento' (removido dessa versão do app)
  //O parametro 1000 representa a prioridade (nesse caso a mais alta)
  $ionicPlatform.registerBackButtonAction(function(e) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    
    $state.go("app.main");
  }, 1000);

  // send GPS position via serial
  var gps = $interval(function() {
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log("0:" + latLng.lat() + ";" + latLng.lng() + "#");
      // serial.write("0:" + latLng.lat() + ";" + latLng.lng() + "#");
    }, function(error){
      console.log("Could not get location");
    }); 
  }, 15000);

  $scope.t = function(){
    console.log('aaaaaa');
  }

})

.controller('statusCtrl', function($scope, $state, $cordovaGeolocation) {
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

.controller('configCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, $ionicPlatform) {
  $scope.manual = {};
  $scope.programada = {};
  $scope.distancia = {};

  $scope.distancia.value = 70;
  $scope.programada.time = new Date('9:20:05');

  // disable menu 
  $scope.$on('$ionicView.afterEnter', function(event) {
    $ionicSideMenuDelegate.canDragContent(false);
  });

  //enable side menu drag before moving to next view
  $scope.$on('$ionicView.beforeLeave', function(event) {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.close = function(){
    if($scope.manual.checked){
      socket.emit('aa');
    } else {
    }
  };

  $scope.setDist = function(){
    if($scope.programada.checked){
      $scope.distancia.checked = false;
      return;
    } else {
      //serial.write('2:' + $scope.distancia.checked?1:0 + ';' + $scope.distancia.value + '#');
      console.log('2:' + $scope.distancia.checked?1:0 + ';' + $scope.distancia.value + '#');
    }
  };

  $scope.setTime = function(){
    var date = new Date($scope.programada.time);

    if($scope.distancia.checked){
      $scope.programada.checked = false;
      return;
    } else {
      //serial.write('3:' + $scope.distancia.checked?1:0 + ';' + date.getHours() + ':' + date.getMinutes() + '#');
      alert('3:' + $scope.distancia.checked?1:0 + ';' + date.getHours() + ':' + date.getMinutes() + '#');
    }
  };
})

.controller('historyCtrl', function($scope) {
  var a = 1;
});