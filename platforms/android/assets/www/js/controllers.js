angular.module('starter.controllers', ['ngCordova'])
.controller('mainCtrl', function($scope, $ionicPlatform, $state, $interval, $cordovaGeolocation, socket) {
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


  socket.on('message', function(message) {
    console.log(message);
     
    var s_message = message.split(':');
    s_message = s_message.substring(0, s_message.length-1);

    switch(s_message[0]){
      case 0:
        var status = s_message[1].split(';');

        window.localStorage['status'] = status[0];

        var dist = status[1].split('-');
        window.localStorage['maxDist'] = dist[0];
        window.localStorage['distOn'] = dist[1];

        var time = status[2].split('-');
        window.localStorage['time'] = time[0].replace(',', ':');
        window.localStorage['progOn'] = time[1];
        break;
      case 1:
        var coords = s_message[1].split(';');
        var latLng = new google.maps.LatLng(coords[0], coords[1]);
        window.localStorage['devicePos'] = JSON.stringify(latLng);
        break;
      case 2:
          var activity = s_message[1].split(';');

          var type;
          switch(activity[0]){
            case 1:
              type = 'Tranca manual';
              break;
            case 2:
              type = 'Tranca por distância';
              break;
            case 3:
              type = 'Tranca programada';
              break;
          }

          var date = new Date();
          
          var entry = {
              "type": type,
              "date": date
          };

          var existingEntries = JSON.parse(localStorage.getItem('activities')) || [];
          existingEntries.push(entry);
          localStorage.setItem('activities', JSON.stringify(existingEntries));
        break;
      default:
        alert("Error in message!");
    }

  });

})

.controller('statusCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.status.checked = window.localStorage.getItem('status')=='1'?true:false;
    $scope.devicePos = JSON.parse(window.localStorage.getItem('devicePos'));
    $scope.maxDist = window.localStorage.getItem('maxDist');
  });
 
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

      var deviceRange = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: $scope.map,
        center: $scope.devicePos,
        radius: $scope.maxDist
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

.controller('configCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, $ionicPlatform, socket) {
  $scope.manual = {};
  $scope.programada = {};
  $scope.distancia = {};

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.manual.checked = window.localStorage.getItem('status')=='1'?true:false;

    $scope.distancia.checked = window.localStorage.getItem('distOn')=='1'?true:false;
    $scope.distancia.value = window.localStorage.getItem('dist');

    $scope.programada.checked = window.localStorage.getItem('progOn')=='1'?true:false;
    $scope.programada.time = new Date(window.localStorage.getItem('prog'));
  });

  // disable menu 
  $scope.$on('$ionicView.afterEnter', function(event) {
    $ionicSideMenuDelegate.canDragContent(false);
  });

  //enable side menu drag before moving to next view
  $scope.$on('$ionicView.beforeLeave', function(event) {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.close = function(){
    var status = $scope.manual.checked?1:0;
    socket.emit('message', '1:' + status  + '#');
    // console.log('1:' + status  + '#');
  };

  $scope.setDist = function(){
    if($scope.programada.checked){
      $scope.distancia.checked = false;
      return;
    } else {
      var status = $scope.distancia.checked?1:0;
      socket.emit('message', '2:' + status + ';' + $scope.distancia.value + '#');
      // console.log("2:" + status + ";" + $scope.distancia.value + "#");
    }
  };

  $scope.setTime = function(){
    var date = new Date($scope.programada.time);

    if($scope.distancia.checked){
      $scope.programada.checked = false;
      return;
    } else {
      var status = $scope.distancia.checked?1:0;
      socket.emit('message', '3:' + status + ';' + date.getHours() + ':' + date.getMinutes() + '#');
      // console.log('3:' + status + ';' + date.getHours() + ';' + date.getMinutes() + '#');
    }
  };
})

.controller('historyCtrl', function($scope) {
  var ar = [{type:"Abertura manual", date:"04/10/2018 9:32"}, {type:"Abertura programada", date:"03/10/2018 4:32"}]
  $scope.activities = ar;

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    $scope.activities = JSON.parse(window.localStorage.getItem('activities'));
  });
});