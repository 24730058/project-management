const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system.js');

const createTreeHelper = require('../../helpers/createTree.js');

// [GET] /admin/products-category

module.exports.index = async (req, res) => {
    let find = {};

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/product-category/index', {
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords,
    })
};
// [GET] /admin/products-category/cteate

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/product-category/create', {
        pageTitle: 'Tạo danh mục sản phẩm',
        records: newRecords
    })
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {

    if(req.body.position == '') {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}
