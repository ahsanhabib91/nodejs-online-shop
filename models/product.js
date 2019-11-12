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
		} catch(err) {
			console.log(err);
		}
	}

}

module.exports = Product;