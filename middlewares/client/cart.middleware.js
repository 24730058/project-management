const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
   if(!req.cookies.cartId) {
    // Tao gio hang
    const cart = new Cart();
    await cart.save();

    const expiresCookie =  60 * 60 * 1000 * 24 * 365; // 1 nam
    res.cookie('cartId', cart.id, {
        expires: new Date(Date.now() + expiresCookie)
    });
   }
   else {
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);

    res.locals.miniCart = cart;
    
   }
    next();
}