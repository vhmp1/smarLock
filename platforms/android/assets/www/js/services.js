var serial_port = '/dev/ttyACM0';
var baud = 9600;
var samples = 100;

angular.module('starter.services', [])

//Factories (fábricas) de dados;
//O if(!promise) comentado em cada Factory checa (quando ativado) se os dados já foram baixados na seção atual,
//para evitar o download a cada vez que a tela for aberta.

.factory('Position', ["$http", function($http){
    var status = [];

    return {
    	getMarker: function(){

    	}
    }
}])


.factory('serial', function($http){
    
});