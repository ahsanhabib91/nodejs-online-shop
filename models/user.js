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

	async getCart() {
		const db = getDB();
		const productIds = this.cart.items.map(item => item.productId);
		let products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();
		return products.map(product => {
			const quantity = this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity;
			return { ...product, quantity };
		});
	}

	deleteItemFromCart(productId) {
		const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
		const db = getDB();
		return db.collection('users').updateOne(
			{ _id: new ObjectId(this._id) },
			{ $set: { cart: { items: updatedCartItems } } }
		);
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