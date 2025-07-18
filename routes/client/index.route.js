const categoryMiddleware = require('../../middlewares/client/category.middleware');

const cartMiddleware = require('../../middlewares/client/cart.middleware');

const userMiddleware = require("../../middlewares/client/user.middleware");

const homeRoute = require('./home.route');
const productRoute = require('./product.route');
const searchRoute = require('./search.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const userRoute = require('./user.route');
const chatRoute = require('./chat.route');


const express = require('express');

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    
    app.use('/', homeRoute);
    
    app.use('/products', productRoute);

    app.use('/search', searchRoute);

    app.use('/cart', cartRoute);

    app.use('/checkout', checkoutRoute);

    app.use('/user', userRoute);

    app.use("/chat", chatRoute);

}