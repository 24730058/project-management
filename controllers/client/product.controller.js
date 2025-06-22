const ProductCategory = require('../../models/product-category.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helpers/products');
const productCategoryHelper = require('../../helpers/products-category');

// [GET] /products

module.exports.index = async (req, res) => {

    
    const products = await Product.find({
        status: 'active',
        deleted: false
    }).sort({ position: "desc"});

    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100 ).toFixed(0);
    });

    res.render('client/pages/products/index', {
        pageTitle: 'Trang san pham',
        products: products
    });
}

// [GET] /products/:slugProduct

module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: 'active',
        };
    
        const product = await Product.findOne(find);

        
        if(product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status: 'active'
            });
            
            product.category = category;
        }
        
        product.priceNew = productHelper.priceNewProduct(product);

        res.render('client/pages/products/detail', {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted: false,
            status: 'active'
        });

        // Kiểm tra xem danh mục có tồn tại không
        if (!category) {
            // Xử lý trường hợp không tìm thấy danh mục
            req.flash('error', 'Danh mục sản phẩm không tồn tại!');
            return res.redirect('/products');
        }

        const listSubCategory = await productCategoryHelper.getSubCategory(category._id);
        const listSubCategoryId = listSubCategory.map(item => item._id);

        const products = await Product.find({
            product_category_id: {$in: [category._id, ...listSubCategoryId]},
            status: 'active',
            deleted: false
        }).sort({ position: "desc"});

        const newProducts = productHelper.priceNewProducts(products);

        res.render('client/pages/products/index', {
            pageTitle: category.title,
            products: newProducts
        });
    } catch (error) {
        // Xử lý lỗi
        req.flash('error', 'Có lỗi xảy ra!');
        res.redirect('/products');
    }
}
