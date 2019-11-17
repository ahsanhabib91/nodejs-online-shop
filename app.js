const path = require("path");

const express = require("express"); // returns a function reference
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// const mongoConnect = require('./util/database').mongoConnect;
const errorController = require("./controllers/error");
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost:27017/online-shop';

const app = express(); // app is a valid request handler function
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store: store
}));

// app.use(async (req, res, next) => {
// 	try {
// 		const user = await User.findById('5dd03792f525021bcec8298d');
// 		req.user = user;
// 		next();	
// 	} catch(err) {
// 		console.error(err);
// 	}
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// console.log(__dirname);

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, retryWrites: true, useNewUrlParser: true })
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


// mongoConnect(() => {
// 	app.listen(3000, () => {
// 		console.log(`Listening on PORT 3000 http://localhost:3000`)
// 	});
// });