var express = require('express');
var router = express.Router();
const { SerialPort } = require("serialport");
var message = "2"; // Thiet lap mode doc du lieu
var result="";
var str="";
//step 1: open connection to COM port
const serialPort = new SerialPort({
path: 'COM8',
baudRate: 9600,
dataBits: 8,
stopBits: 1,
parity: 'none',
}, function(err){
if(err)
console.log("Error",err.message);
else
console.log("OK");
});
//step 2 register to listen open the port
//router.get('/connect', function(req, res, next) {
serialPort.on("open", function() {
console.log("-- Connection opened --");
//step 3 test send message to HC05
serialPort.write(message, function(err) {
if (err) {
console.log("Error on write: ", err.message);
return serialPort.close();
}
console.log("Message sent successfully");
});
//step 4 register listen data on the open port and process receiced
message
serialPort.on("data", function(data) {
str+=data;
result = data;
console.log('data'+data);
});
});
router.get('/', async function(req, res, next) {
res.render('simpleGateway', { data: result });
});
router.get('/on', function(req, res, next) {
serialPort.write("1", function(err) {
if (err) {
return console.log("Error on write: ", err.message);
}
});
res.render('simpleGateway', { data: result });
});
router.get('/off', function(req, res, next) {
serialPort.write("0", function(err) {
if (err) {
return console.log("Error on write: ", err.message);
}
});
res.render('simpleGateway', { data: result });
});
module.exports = router;