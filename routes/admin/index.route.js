const systemConfig = require('../../config/system.js');

const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
const productCategoryRoute = require('./product-category.route');
const rolesRoute = require('./roles.route');
const accountsRoute = require('./account.route');
const authRoute = require('./auth.route');




module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoute);

    app.use(PATH_ADMIN + '/products', productRoute);

    app.use(PATH_ADMIN + '/products-category', productCategoryRoute);

    app.use(PATH_ADMIN + '/roles', rolesRoute);

    app.use(PATH_ADMIN + '/accounts', accountsRoute);

    app.use(PATH_ADMIN + '/auth', authRoute);



}