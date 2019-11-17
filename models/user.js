const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});

userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
	const updatedCartItems = [...this.cart.items];
	if(cartProductIndex >=0 ) {
		updatedCartItems[cartProductIndex].quantity++;
	} else {
		updatedCartItems.push({ productId: product._id, quantity: 1 });
	}
	this.cart = { items: updatedCartItems };
	this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
	const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
	this.cart.items = updatedCartItems;
	return this.save();
}

userSchema.methods.clearCart = function() {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;

// const ObjectId = mongodb.ObjectId;

// class User {
// 	constructor(username, email, cart, id) {
// 		this.name = username;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = id;
// 	}

// 	async save() {
// 		try {
// 			const db = getDB();
// 			return db.collection('users').insertOne(this);
// 		} catch(err) {
// 			throw err;
// 		}
// 	}

// 	addToCart(product) {
// 		try {
// 			const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
// 			const updatedCartItems = [...this.cart.items];
// 			if(cartProductIndex >=0 ) {
// 				updatedCartItems[cartProductIndex].quantity++;
// 			} else {
// 				updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 });
// 			}
// 			const updatedCart = { items: updatedCartItems };
// 			const db = getDB();
// 			return db.collection('users').updateOne(
// 				{ _id: new ObjectId(this._id) },
// 				{ $set: { cart: updatedCart } }
// 			);
// 		} catch(err) {
// 			throw err;
// 		}
// 	}

// 	async getCart() {
// 		const db = getDB();
// 		const productIds = this.cart.items.map(item => item.productId);
// 		let products = await db.collection('products').find({ _id: { $in: productIds } }).toArray();
// 		return products.map(product => {
// 			const quantity = this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity;
// 			return { ...product, quantity };
// 		});
// 	}

// 	deleteItemFromCart(productId) {
// 		const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
// 		const db = getDB();
// 		return db.collection('users').updateOne(
// 			{ _id: new ObjectId(this._id) },
// 			{ $set: { cart: { items: updatedCartItems } } }
// 		);
// 	}

// 	async addOrder() {
// 		const db = getDB();
// 		const products = await this.getCart();
// 		const order = {
// 			items: products,
// 			user: {
// 			  _id: new ObjectId(this._id),
// 			  name: this.name
// 			}
// 		};
// 		const result = await db.collection('orders').insertOne(order);
// 		this.cart = { items: [] };
// 		return db.collection('users').updateOne(
// 			{ _id: new ObjectId(this._id) },
// 			{ $set: { cart: { items: [] } } }
// 		);
// 	}

// 	getOrders() {
// 		const db = getDB();
// 		return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
// 	}

// 	static findById(userId) {
// 		try {
// 			const db = getDB();
// 			return db.collection('users').findOne({ _id: new ObjectId(userId) });
// 		} catch(err) {
// 			throw err;
// 		}
// 	}


// }

// module.exports = User;