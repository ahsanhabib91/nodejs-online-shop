const path = require("path");

const express = require("express"); // returns a function reference
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const errorController = require("./controllers/error");
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express(); // app is a valid request handler function

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
	try {
		const user = await User.findById('5dd03792f525021bcec8298d'); // Model.findById(doc_id): mongoose method to find a single doc by _id. Also _id turn into mongodb.ObjectId
		req.user = user;
		next();	
	} catch(err) {
		console.error(err);
	}
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// console.log(__dirname);

// mongoConnect(() => {
// 	app.listen(3000, () => {
// 		console.log(`Listening on PORT 3000 http://localhost:3000`)
// 	});
// });


mongoose.connect('mongodb://localhost:27017/online-shop', { useUnifiedTopology: true, retryWrites: true, useNewUrlParser: true })
.then( async (result) => {
	const user = await User.findOne();
	if (!user) {
		const user = new User({
		  	name: 'Habib',
		  	email: 'habib@gmail.com',
		  	cart: {
				items: []
			}
		});
		user.save();
	}
	app.listen(3000, () => {
		console.log(`Listening on PORT 3000 http://localhost:3000`)
	});
}).catch(err => console.error(err));

