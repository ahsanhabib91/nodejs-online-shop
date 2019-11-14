const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const product = new Product(title, price, description, imageUrl);
	try {
		const result = await product.save();
		console.log('Created Product');
		res.redirect('/admin/products');
	} catch(err) {
		console.log(err);
	}

};

exports.getEditProduct = async (req, res, next) => {
	try {
		const editMode = req.query.edit;
		if (!editMode) {
		  return res.redirect('/');
		}
		const productId = req.params.productId;
		const product = await Product.findById(productId);
		if (!product) {
		  return res.redirect('/');
		}
		res.render('admin/edit-product', {
		  pageTitle: 'Edit Product',
		  path: '/admin/edit-product',
		  editing: editMode,
		  product: product
		});
	} catch(err) {
		console.error(err);
	}
};

exports.postEditProduct = async (req, res, next) => {
	try {
		const productId = req.body.productId;
		const updatedTitle = req.body.title;
		const updatedPrice = req.body.price;
		const updatedImageUrl = req.body.imageUrl;
		const updatedDesc = req.body.description;
		const updatedProduct = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl, productId);
		const result = await updatedProduct.save();
		console.log('UPDATED PRODUCT!');
		res.redirect('/admin/products');
	} catch(err) {
		console.error(err);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();
			res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	} catch(err) {
		console.error(err);
	}
};

exports.postDeleteProduct = async (req, res, next) => {
	try {
		const productId = req.body.productId;
		const result = await Product.deleteById(productId);
		console.log('PRODUCT DELETED!');
		res.redirect('/admin/products');
	} catch(err) {
		console.error(err);
	}
};
