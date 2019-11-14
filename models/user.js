const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

const ObjectId = mongodb.ObjectId;

class User {
	constructor(username, email) {
		this.name = username;
		this.email = email;
	}

	async save() {
		try {
			const db = getDB();
			return db.collection('users').insertOne(this);
		} catch(err) {
			throw err;
		}
	}

	static findById(userId) {
		try {
			const db = getDB();
			return db.collection('users').findOne({ _id: new ObjectId(userId) });
		} catch(err) {
			throw err;
		}
	}


}

module.exports = User;