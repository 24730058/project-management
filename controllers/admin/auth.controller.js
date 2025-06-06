// [GET] /admin/auth/login
const md5 = require('md5');
const Account = require('../../models/account.model');

const Role = require('../../models/role.model');

const systemConfig = require('../../config/system')

module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: 'Trang đăng nhập'
    });
};

// [POST] /admin/auth/login

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false,
    });

    if(!user) {
        req.flash('error', 'Tài khoản không tồn tại');
        res.redirect(req.get('referer'));
        return;
    };

    if(user.password !== md5(password)) {
        req.flash('error', 'Mật khẩu không đúng');
        res.redirect(req.get('referer'));
        return;
    }

     if(user.status == 'inactive') {
        req.flash('error', 'Tài khoản đã bị khóa');
        res.redirect(req.get('referer'));
        return;
    }
    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

};

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};