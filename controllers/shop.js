const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
	try {
		// const products = await Product.fetchAll();
		const products = await Product.find(); // Model.find(): mongoose method to find all documents 
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Products',
			path: '/products'
		});
	} catch(err) {
		console.log(err);
	}
};

exports.getProduct = async (req, res, next) => {
	try {
		const productId = req.params.productId;
		const product = await Product.findById(productId); // Model.findById(doc_id): mongoose method to find a single doc by _id. Also _id turn into mongodb.ObjectId
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	} catch(err) {
		console.log(err);
	}
};

exports.getIndex = async (req, res, next) => {
	try {
		// const products = await Product.fetchAll();
		const products = await Product.find(); // Model.find(): mongoose method to find all documents
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/'
		});
	} catch(err) {
		console.log(err);
	}
};

exports.getCart = async (req, res, next) => {
	try {
		// const products = await req.user.getCart();
		const user = await req.user.populate('cart.items.productId').execPopulate();
		const products = user.cart.items;
		res.render('shop/cart', {
			path: '/cart',
			pageTitle: 'Your Cart',
			products: products
		});
	} catch(err) {
		console.error(err);
	}
};

exports.postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		const product = await Product.findById(prodId);
		const result = await req.user.addToCart(product); // Model.findById(doc_id): mongoose method to find a single doc by _id. Also _id turn into mongodb.ObjectId
		console.log(`Product "${product.title}" added to the cart`);
		res.redirect('/cart');
	} catch(err) {
		console.error(err);
	}
};

exports.postCartDeleteProduct = async (req, res, next) => {
	try {
		const productId = req.body.productId;
		const result = await req.user.deleteItemFromCart(productId);
		console.log('Item Deleted');
		res.redirect('/cart');
	} catch(err) {
		console.error(err);
	}
};

exports.getOrders = async (req, res, next) => {
	try {
		// const orders = await req.user.getOrders();
		const orders = await Order.find({ 'user.userId': req.user._id });
		res.render('shop/orders', {
			path: '/orders',
			pageTitle: 'Your Orders',
			orders: orders
		});
	} catch(err) {
		console.error(err);
	}
};

exports.postOrder = async (req, res, next) => {
	try {
		// const result = await req.user.addOrder();
		const user = await req.user.populate('cart.items.productId').execPopulate();
		console.log(user.cart.items);
		const products = user.cart.items.map(item => {
			return { product: {...item.productId._doc},  quantity: item.quantity }
		});
		const order = new Order({
			user: {
				email: req.user.email,
				userId: req.user
			},
			products: products
		});
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch(err) {
		console.error(err);
	}
	
  };

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};
