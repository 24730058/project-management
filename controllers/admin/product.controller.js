const Product = require('../../models/product.model');

const systemConfig = require('../../config/system.js');


const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');


// [GET] /admin/products

module.exports.index = async (req, res) => {


    // Bo loc
    const filterStatus = filterStatusHelper(req.query);
    // End Bo loc

    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Tim kiem
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // End Tim kiem

    // Pagination
    const countProduct = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProduct,
    );

    // End Pagination
    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = 'desc';
    }
    // end sort
    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip).sort(sort);

    res.render('admin/pages/product/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    })
};


// [PATCH] /admin/products/change-status/:status/:id/

module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;

    await Product.updateOne(
        { _id: id },
        { status: status }
    );

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');

    res.redirect(req.get("Referer"));
}


// [PATCH] /admin/products/change-multi

module.exports.changeMuti = async (req, res) => {

    const type = req.body.type;
    const ids = req.body.ids.split(',');

    switch (type) {

        case 'active':
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: 'active' }
            );

            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case 'inactive':
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: 'inactive' }
            );

            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case 'delete-all':
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true },
                {
                    deletedAt: new Date()
                }
            );

            req.flash('success', `Xóa thành công ${ids.length} sản phẩm!`);
            break;
        case 'change-position':
            for (const item of ids) {
                let [id, position] = item.split('-');

                position = parseInt(position);

                await Product.updateOne(
                    {
                        _id: id
                    },
                    {
                        position: position
                    }
                );
            }
            req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    res.redirect(req.get("Referer"));

}


// [DELETE] /admin/products/DELETE/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;


    // Xoa vinh vien
    // await Product.deleteOne(
    //     { _id: id }
    // );

    // Xoa tam thoi
    await Product.updateOne(
        {
            _id: id
        },
        {
            deleted: true
        },
        {
            deletedAt: new Date()
        }
    );

    req.flash('success', `Xóa thành công sản phẩm!`);
    res.redirect(req.get("Referer"));
}

// [GET] /admin/products/create

module.exports.create = async (req, res) => {
    res.render('admin/pages/product/create', {
        pageTitle: 'tao san pham',
    })
}

// [POST] /admin/products/create

module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == '') {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);

    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}


// [GET] /admin/products/edit/:id

module.exports.edit = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render('admin/pages/product/edit', {
            pageTitle: 'Chỉnh sửa sản phẩm',
            product: product,
        });
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    };

    try {
        await Product.updateOne(
            {
            _id: id
            }, req.body
        );
        req.flash('success', 'Cập nhật sản phẩm thành công!');
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại!');
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}


// [GET] /admin/products/detail/:id

module.exports.detail = async (req, res) => {
    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render('admin/pages/product/detail', {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}