var server_port = '1234'
var client_address = '127.0.0.1'
// This should match the serial port that you board is connected to
var serial_port = "/dev/cu.usbserial-FTHBRJSI"
var baud = 9600
var samples = 100

// open serial port
var SerialPort = require("serialport").SerialPort
var sp = new SerialPort(serial_port,{baudrate:baud})

sp.open(function(error) {
   if (error) {
      console.log('can not open '+serial_port)
      }
   else {
      console.log('opened '+serial_port)
      sp.on('data',function(data) {
         console.log(JSON.stringify(data[0]));
         value = data[0];
      });
   }
})

console.log("listening for connections from "+client_address+" on "+server_port)
var Server = require('ws').Server
wss = new Server({port:server_port})
wss.on('connection', function(ws) {
   if (ws._socket.remoteAddress != client_address) {
      console.log("error: client address doesn't match")
      return
      }
   console.log("connected to "+client_address+" on port "+server_port)

   // when recieving data from the websocket, send it to the serial port  
   ws.on('message', function(data) {
      console.log('received: %s', data);
      sp.write(data);
   });

   // when recieving data from serial port - send it to the web socket
   sp.on('data', function (data) {
        ws.send(JSON.stringify(data[0]));
    });
})