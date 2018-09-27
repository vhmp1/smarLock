angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    var errorCallback = function(message) {
      alert('Error: ' + message);
    };

    serial.requestPermission({vid: '0451', pid: 'f432'},
      function(successMessage) {
        // open serial port
        serial.open({baudRate: 9600}, function(successMessage) {
          open = true;
          // register the read callback
          serial.registerReadCallback(function success(data){
            // decode the received message
            var view = new Uint8Array(data);
            if(view.length >= 1) {
              for(var i=0; i < view.length; i++) {
                // if we received a \n, the message is complete, display it
                if(view[i] == 13) {
                  // check if the read rate correspond to the arduino serial print rate
                  var now = new Date();
                  delta.innerText = now - lastRead;
                  lastRead = now;

                  // display the message
                  var value = parseInt(str);
                  pot.innerText = value;
                  str = '';
                } else {
                  var temp_str = String.fromCharCode(view[i]);
                  var str_esc = escape(temp_str);
                  str += unescape(str_esc);
                }
              }
            }
          }, errorCallback);
        },
        // error opening the port
        errorCallback); 
      },
      // user does not grant permission
      errorCallback
    );

  });
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