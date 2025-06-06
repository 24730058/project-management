const Role = require('../../models/role.model.js');
const systemConfig = require('../../config/system.js');

// [GET] /admin/roles

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);
    res.render('admin/pages/roles/index', {
        pageTitle: 'Trang nhóm quyền',
        records: records,
    });
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: 'Tạo nhóm quyền',
    });
};
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    console.log(req.body);

    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);

    res.render('admin/pages/roles/permissions', {
        pageTitle: 'Phân quyền',
        records: records,
    });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({_id: item.id}, {permissions: item.permissions})

    }
    res.redirect(req.get('referer'));

};