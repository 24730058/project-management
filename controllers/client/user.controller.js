const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model.js");
const Cart = require("../../models/cart.model");

const md5 = require("md5");


const generateHelper = require("../../helpers/generate.js");
const sendMailHelper = require("../../helpers/sendMail.js");

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
  // Kiểm tra và xử lý giỏ hàng của người dùng
  const userCart = await Cart.findOne({
    user_id: existUser.id
  });
  
  if(userCart) {
    // Người dùng đã có giỏ hàng từ trước
    if(req.cookies.cartId) {
      // Có giỏ hàng trong cookie, hợp nhất 2 giỏ hàng
      const currentCart = await Cart.findOne({
        _id: req.cookies.cartId
      });
      
      if(currentCart && currentCart.products.length > 0) {
        // Thêm sản phẩm từ giỏ hàng hiện tại vào giỏ hàng người dùng
        await Cart.updateOne(
          { _id: userCart._id },
          { $push: { products: { $each: currentCart.products } } }
        );
        
        // Xóa giỏ hàng hiện tại
        await Cart.deleteOne({ _id: req.cookies.cartId });
      }
    }
    // Gán cookie cartId thành giỏ hàng của người dùng
    res.cookie("cartId", userCart.id);
  } else if(req.cookies.cartId) {
    // Người dùng chưa có giỏ hàng, gán giỏ hàng hiện tại cho người dùng
    await Cart.updateOne(
      { _id: req.cookies.cartId },
      { user_id: existUser.id }
    );
  }
  
  res.cookie("tokenUser", existUser.tokenUser);

  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  req.flash("success", "Đã đăng xuất!");
  res.redirect("/");
};


// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false
  });

  if(!existUser) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  // Việc 1: Lưu email và mã OTP vào database
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  });

  if(!existEmailInForgotPassword) {
    const otp = generateHelper.generateRandomNumber(6);

    const data = {
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + 3 * 60 * 1000)
    };
  
    const record = new ForgotPassword(data);
    await record.save();
  
    // Việc 2: Gửi mã OTP qua email cho user
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, text);
  }

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email
  });
};

// [POST] /user/password/otp

module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!existRecord) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu"
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({
    tokenUser: tokenUser,
    status: "active",
    deleted: false
  }, {
    password: md5(password)
  });

  req.flash("success", "Đổi mật khẩu thành công!");

  res.redirect("/");
}

// [GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/user/profile", {
    pageTitle: "Thông tin tài khoản",
  });
};