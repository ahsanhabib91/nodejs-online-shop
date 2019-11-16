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
			const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
			const updatedCartItems = [...this.cart.items];
			if(cartProductIndex >=0 ) {
				updatedCartItems[cartProductIndex].quantity++;
			} else {
				updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 });
			}
			const updatedCart = { items: updatedCartItems };
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