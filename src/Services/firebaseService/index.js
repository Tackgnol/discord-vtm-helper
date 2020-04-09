const firebase = require('firebase/app');
const auth = require('../../../config/auth')
class FirebaseService {
	constructor() {
		this.service = firebase.initializeApp(auth.firebase);
	}
}

module.exports = FirebaseService;
