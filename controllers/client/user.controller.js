const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.js");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const user = req.body;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if(existUser) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }

  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
    tokenUser: generateHelper.generateRandomString(30),
    status: "active"
  };

  const newUser = new User(dataUser);
  await newUser.save();

  res.cookie("tokenUser", newUser.tokenUser);

  req.flash("success", "Đăng ký tài khoản thành công!");

  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if(!existUser) {
    req.flash("error", "Email không tồn tại trong hệ thống!");

    res.redirect(req.get("referer"));

    return;
  }

  if(md5(password) != existUser.password) {
    req.flash("error", "Sai mật khẩu!");

    res.redirect(req.get("referer"));

    return;
  }

  if(existUser.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");

    res.redirect(req.get("referer"));

    return;
  }

  res.cookie("tokenUser", existUser.tokenUser);

  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đã đăng xuất!");
  res.redirect("/");
};
