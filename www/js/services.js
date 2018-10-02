angular.module('starter.services', [])

//Factories (fábricas) de dados;
//O if(!promise) comentado em cada Factory checa (quando ativado) se os dados já foram baixados na seção atual,
//para evitar o download a cada vez que a tela for aberta.

.factory('socket', function($rootScope){
  var socket = io.connect();
  
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