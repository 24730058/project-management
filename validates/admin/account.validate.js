module.exports.createPost = (req, res, next) => {

    if(!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập tên');
        res.redirect(req.get("Referer"));
        return;
    }
    if(!req.body.email) {
        req.flash('error', 'Vui lòng nhập email');
        res.redirect(req.get("Referer"));
        return;
    }
    if(!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        res.redirect(req.get("Referer"));
        return;
    }
    next();
}