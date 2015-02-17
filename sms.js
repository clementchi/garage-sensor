var twilioClient = require('twilio');
	config = require('./config.js');

// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account
var sendSMSHandler = function(subject, content){
	twilioClient(config.sms.acctSID, config.sms.authToken).messages.create({
    	body: subject + ' ' + content,
    	to: config.sms.to.toString(),
    	from: config.sms.from
	}, function(err, message) {
		if (err){
			console.log(err);	
		}
		console.log(message);
	});
};


module.exports = {
	send: sendSMSHandler
}
