var nodemailer = require('nodemailer'),
var config = require('./config.js');

//generate oauth token
var generator = require('xoauth2').createXOAuth2Generator({
      user: config.email.oauth.user, 
      clientId: config.email.oauth.clientId,
      clientSecret: config.email.oauth.clientSecret,
      refreshToken: config.email.oauth.refreshToken,
      accessToken: config.email.oauth.accessToken
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// login
var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));

var sendEmail = function(subject, content){
		if (subject === ''){
			subject = 'unknown subject';
		}
		
		if(content === ''){
			content = 'unknown content';
		}
	
		console.log('mail is send to clementchi@yahoo.com '+content);
		// send mail
		transporter.sendMail({
  			from: config.email.message.from,
  			to: config.email.message.to.toString(),
  			subject: subject,
  			generateTextFromHTML: true,
  			html: '<b>'+content+'</b>'
		});
	}


module.exports = {
	send: sendEmail
}