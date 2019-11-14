const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id ? new mongodb.ObjectId(id) : null;
	}

	async save() {
		try {
			const db = getDB();
			let dbOp;
			if(this._id) {
				dbOp = await db.collection('products').updateOne({ _id: this._id }, { $set: this });
			} else {
				dbOp = await db.collection('products').insertOne(this);
			}
			// console.log(dbOp);
			return dbOp;
		} catch(err) {
			console.log(err);
			throw err;
		}
	}

	static async fetchAll() {
		try {
			const db = getDB();
			const products = await db.collection('products').find().toArray();
			console.log(products);
			return products;
		} catch(err) {
			console.log(err);
			throw err;
		}
	}

	static async findById(productId) {
		try {
			const db = getDB();
			const product = await db.collection('products').find({ _id: new mongodb.ObjectID(productId) }).next();
			console.log(product);
			return product;
		} catch(err) {
			console.error(err);
			throw err;
		}
	}

	static async deleteById(productId) {
		try {
			const db = getDB();
			const result = await db.collection('products').deleteOne({ _id: new mongodb.ObjectID(productId) });
			return result;
		} catch(err) {
			console.error(err);
			throw err;
		}
	}

}

module.exports = Product;