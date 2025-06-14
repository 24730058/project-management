const categoryMiddleware = require('../../middlewares/client/category.middleware');

const homeRoute = require('./home.route');
const productRoute = require('./product.route');


const express = require('express');
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    
    app.use('/', homeRoute);
    app.use('/products', productRoute);
}