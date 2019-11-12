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
		const client = await MongoClient.connect('mongodb://localhost:27017/online-shop', { useUnifiedTopology: true, retryWrites: true });
		console.log('Connected!');
		// _db = client.db('another-DB'); // can be connected to another database and overwrite the default
		_db = client.db();
		callback();
	} catch (err) {
		console.log(err);
    	throw err;
	}
	
}

const getDB = () => {
	if (_db) {
	  return _db;
	}
	throw 'No database found!';
  };
  

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;