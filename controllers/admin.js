const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	// console.log(req.user);
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = async (req, res, next) => {
	try {
		const title = req.body.title;
		const price = req.body.price;
		const description = req.body.description;
		const imageUrl = req.body.imageUrl;
		// const product = new Product(title, price, description, imageUrl, null, req.user._id);
		const product = new Product({ title, price, description, imageUrl, userId: req.user });
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
		const product = await Product.findById(productId); // Model.findById(doc_id): mongoose method to find a single doc by _id. Also _id turn into mongodb.ObjectId
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
		// const updatedProduct = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl, productId);
		let product = await Product.findById(productId);
		product.title = updatedTitle;
		product.price = updatedPrice;
		product.imageUrl = updatedImageUrl;
		product.description = updatedDesc;
		const result = await product.save();
		console.log('UPDATED PRODUCT!');
		res.redirect('/admin/products');
	} catch(err) {
		console.error(err);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		// const products = await Product.fetchAll();
		// const products = await Product.find().select('title price -_id').populate('userId', 'name'); // Model.find(): mongoose method to find all documents
		const products = await Product.find(); // Model.find(): mongoose method to find all documents
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
		// const result = await Product.deleteById(productId);
		const result = await Product.findByIdAndDelete(productId);
		console.log('PRODUCT DELETED!');
		res.redirect('/admin/products');
	} catch(err) {
		console.error(err);
	}
};
