module.exports = {
	notificationProvider : './sms.js',
	sms: {
		acctSID: '',
		authToken: '',
		from: '',
		to: '' 
	},
	email: {
		oauth: {
      		user: '', 
      		clientId: ',
      		clientSecret: '',
      		refreshToken: '',
      		accessToken: ''	
		},
		message: {
			from: '',
  			to: [],

		}
	}
}