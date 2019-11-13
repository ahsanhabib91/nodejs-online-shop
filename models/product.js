const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product {
	constructor(title, price, description, imageUrl) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	async save() {
		try {
			const db = getDB();
			const result = await db.collection('products').insertOne(this);
			console.log(result);
			return result;
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
			console.log(err);
			throw err;
		}
	}

}

module.exports = Product;