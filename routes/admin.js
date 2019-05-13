const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

router.get("/add-product", productsController.getProduct);
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
