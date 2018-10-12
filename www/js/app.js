angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $cordovaGeolocation, socket) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  document.addEventListener('deviceready', function () {
    cordova.plugins.backgroundMode.overrideBackButton();
    cordova.plugins.backgroundMode.excludeFromTaskList();

    cordova.plugins.backgroundMode.configure({silent: true});
    cordova.plugins.backgroundMode.setDefaults({
      title: "smartLock",
      text: "Checando posição do dispositivo...",
    });

    // Enable background mode
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.isActive();

    cordova.plugins.backgroundMode.on('activate', function () {
      cordova.plugins.backgroundMode.disableWebViewOptimizations();
    });

    // Run when the device is ready
    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
      // send GPS position via socket
      var gps = $interval(function() {
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
          // var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          console.log("0:" + latLng.lat() + ";" + latLng.lng() + "#");
          socket.emit("message", "0:" + latLng.lat() + ";" + latLng.lng() + "#");
        }, function(error){
          console.log("Could not get location");
        }); 
      }, 15000);
    }

  }, false);

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'mainCtrl'
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'index.html'
        //, controller: 'mainCtrl'
      }
    }
  })

  .state('app.status', {
    url: '/status',
    views: {
      'menuContent': {
        templateUrl: 'templates/status.html',
        controller: 'statusCtrl'
      }
    }
  })

  .state('app.config', {
    url: '/config',
    views: {
      'menuContent': {
        templateUrl: 'templates/config.html',
        controller: 'configCtrl'
      }
    }
  })

  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
      }
    }
  });
 
  $urlRouterProvider.otherwise('/app/main');
  $ionicConfigProvider.views.transition('none');
});