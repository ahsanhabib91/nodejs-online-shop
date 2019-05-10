const path = require('path');

const express = require('express'); // returns a function reference
var bodyParser = require('body-parser');

const app = express(); // app is a valid request handler function

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// console.log(__dirname);
app.listen(3000);
