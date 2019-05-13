const path = require("path");

const express = require("express"); // returns a function reference
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express(); // app is a valid request handler function

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// console.log(__dirname);
app.listen(3000);