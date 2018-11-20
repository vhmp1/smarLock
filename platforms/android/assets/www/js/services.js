var baseUrl = 'http://10.0.3.2:5000/';

angular.module('starter.services', [])

.factory('socket', function($rootScope){
  //var socket = io.connect(baseUrl);
  var socket = io(baseUrl, {transports: ['websocket'], upgrade: false});
  
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})