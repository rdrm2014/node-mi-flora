/**
 * Created by ricardomendes on 30/09/15.
 */
var merge = require('merge');

var mqtt = require("mqtt");

var client = mqtt.connect("mqtt://127.0.0.1");

var topic = "miFlora";
var message;

/*if(process.argv.indexOf("-t") != -1){
    topic = process.argv[process.argv.indexOf("-t") + 1];
}
if(process.argv.indexOf("-m") != -1){
    message = process.argv[process.argv.indexOf("-m") + 1];
}*/

var args = {
	qos: 0,
	retain: true
};

const MiFlora = require('../index');

let flora = new MiFlora("c4:7c:8d:62:d1:69");

flora.startScanning();
/*
flora.on('data', function (data) {
  console.log('data', data);
});

flora.on('firmware', function (data) {
  console.log('firmware', data);
});*/

flora.on('firmware', function (data) {
  flora.on('data', function (dataDevice) {
    //console.log('firmware', data);
	//console.log('data', dataDevice);
    message = JSON.stringify(merge(data, dataDevice));
    client.publish(topic, new Buffer(message), args, function() {
		console.log(message);
    });
    
  });
});

setInterval(function () {
  console.log('every 30 seconds, rescan devices');
  flora.startScanning();
}, 30000);


//client.publish(topic, new Buffer(message));
//client.end();
