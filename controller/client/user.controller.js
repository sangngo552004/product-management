const md5 = require("md5");
const User = require("../../models/user.model");

const generateHelper = require("../../helpers/generate.helper");

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
