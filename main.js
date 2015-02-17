var Gpio = require('onoff').Gpio,
    doorSensor = new Gpio(23, 'in', 'rising'),
	figlet = require('figlet')
	config = require('./config.js');

//interval function instance
var intervalHandler = null;
//number of time the interval has been trigger
var counter = 0;	
//Time before the 1st notification is triggered
const EMAIL_NOTI_INTERVAL = 120000;
//Time interval for each garage door sensor ping
const PING_INTERVAL = 10000;
//last interrupt value
var last5Values = [0,0,0,0,0];
//mail sent flag
var hasNotified = false;

var notificationProvider = require(config.notificationProvider);

//email when garage door is open
var doorOpenNotificationHandler = function(){
		counter ++;	
		var openDuration = (counter * EMAIL_NOTI_INTERVAL) / 1000;		
		notificationProvider.send('ALERT: GARAGE DOOR IS OPEN', 'Auto notification, garage door has been opened for '+ openDuration +'s');
		console.log('mail sent with open duration '+openDuration);
		hasNotified = true;
	}
	
//email when garage door is open
var doorClosedNotificationHandler = function(){
		notificationProvider.send('ALERT CANCELLED: GARAGE DOOR IS CLOSED', 'Auto notification, garage door is closed.');
		hasNotified = false;
	}	
	
figlet('Garage Door Sensor', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});	

//take garage door reading every 10 seconds	
setInterval(function(){
	//read sensor
	var lastValue = doorSensor.readSync();
	
	//fill the buffer
	last5Values.shift();
	last5Values.push(lastValue);			
	
	console.log('last 5 garage door sensor readings '+last5Values.toString());
	
	//reduce function
	var reduceFunction = function(previousValue, currentValue, index, array){
			return previousValue + currentValue;
		};

	//sum of all array items
	var testVal = last5Values.reduce(reduceFunction);

	//if testVal is 0 garage door is closed	
	if (testVal === 0){
		console.log('Door is closed');
		if (intervalHandler !== null){
			console.log('Notification deactivated');
			clearInterval(intervalHandler);
			intervalHandler = null;
			counter = 0;
			if (hasNotified){
				doorClosedNotificationHandler();
			}
		}
	}
	//otherwse garage door is open
	else{
		console.log('Door is open');
		if (intervalHandler === null){
			console.log('Notification activated');
			intervalHandler = setInterval(doorOpenNotificationHandler, EMAIL_NOTI_INTERVAL);
		}
	}
}, PING_INTERVAL)

function exit() {
  doorSensor.unexport();
  process.exit();
}

process.on('SIGINT', exit);