const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async callback => {
	// MongoClient.connect('mongodb://localhost:27017/online-shop')
	// .then(client => {
	// 	console.log('Connected!');
	// 	callback(client);
	// }).catch(err => {
	// 	console.log(err);
    // 	throw err;
	// });
	try {
		const client = await MongoClient.connect('mongodb://localhost:27017/online-shop');
		console.log('Connected!');
		callback(client);
	} catch (err) {
		console.log(err);
    	throw err;
	}
	
}

exports.mongoConnect = mongoConnect;