const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

const ObjectId = mongodb.ObjectId;

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	async save() {
		try {
			const db = getDB();
			return db.collection('users').insertOne(this);
		} catch(err) {
			throw err;
		}
	}

	addToCart(product) {
		try {
			// const cartProduct = this.cart.items.findIndex(cp => cp._id == product._id);
			const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
			const db = getDB();
			return db.collection('users').updateOne(
				{ _id: new ObjectId(this._id) },
				{ $set: { cart: updatedCart } }
			);
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