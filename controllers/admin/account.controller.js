const Account = require('../../models/account.model.js');
const systemConfig = require('../../config/system.js');
const md5 = require('md5');
const Role = require('../../models/role.model.js');

// [GET] /admin/accounts

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select('-password -token');
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;

    }
    res.render('admin/pages/accounts/index', {
        pageTitle: 'Danh sach tai khoan',
        records: records,
    });
};

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    });
    res.render('admin/pages/accounts/create', {
        pageTitle: 'Tao tai khoan',
        roles: roles,
    });
};

module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (emailExist) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect(req.get('referer'));

    } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

};