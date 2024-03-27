const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/send-mail.helper");

//[GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
      pageTitle: "Đăng ký tài khoản",
    });
};

//[POST] user/register
module.exports.registerPost = async (req, res) => {
    const existUser = await User.findOne({
        email : req.body.email
    })

    if (existUser) {
        req.flash("error", "Tài khoản đã tồn tại");
        res.redirect("back");
        return;
    }

    const infoUser = {
        fullName : req.body.fullName,
        email : req.body.email,
        password : md5(req.body.password),
        tokenUser : generateHelper.generateRandomString(30)
    }
    const user = new User(infoUser);
    await user.save();
    const cart = new Cart({
      userId : user.id,
      products : []
    });
    await cart.save();
    res.cookie("tokenUser", infoUser.tokenUser);
    res.redirect("/");
}

//[GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập tài khoản",
    });
};

//[POST] user/loginPost
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email : req.body.email,
        deleted : false
    })
    if (!user) {
        req.flash("error", "Email bạn nhập không tồn tại!");
        res.redirect("back");
        return;
    }

    if (user.password != md5(req.body.password)) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;        
    }
    await User.updateOne({
        _id: user.id
      }, {
        statusOnline: "online"
      });
    _io.on("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS", {
            userId : user.id,
            status : "online"
        })
    })
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

//[GET] user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    const userId = res.locals.user.id;
    await User.updateOne({
        _id: userId
      }, {
        statusOnline: "offline"
      });
    _io.once("connection", (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS", {
          userId: userId,
          status: "offline"
        });
      });
    res.redirect("/");
}

//[GET] user/password/forgot
module.exports.forgotPassword =  (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

//[POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email : email,
    deleted : false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);
  // Việc 1: Lưu thông tin vào database
  const objectForgotPassword = {
    email : email,
    otp : otp,
    expiresAt : Date.now() + 5
  };

  const record = new ForgotPassword(objectForgotPassword);
  await record.save();
  //Việc 2: gửi mã OTP qua email
  const subject = `Mã OTP lấy lại lại mật khẩu`;
  const content = `Mã OTP của bạn là <b>${otp}</b>. Vui lòng không chia sẻ với bất cứ ai.`;
  sendMailHelper.sendMail(email, subject, content);

  res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập otp",
    email : email
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
 
  const find = {
    email : email,
    otp : otp
  }
  const result = await ForgotPassword.findOne(find);

  if(!result) {
    req.flash("error","OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email : email
  });
  
  res.cookie("tokenUser",user.tokenUser);
  res.redirect('/user/password/reset');
};

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {

  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu"
  });
};

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const password = req.body.password;

  try {
    await User.updateOne({
      tokenUser : tokenUser
    },{
      password : md5(password)
    });
    res.redirect("/");
  }catch(error) {
    console.log(error);
    res.redirect("back");
  }
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};