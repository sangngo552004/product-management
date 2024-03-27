const configSystem = require("../../config/system");
const md5 = require("md5");
const Account = require("../../models/account.model");

//[GET] admin/my-account
module.exports.index = (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/my-account/index.pug`, {
        pageTitle : "Thông tin cá nhân"
    });
};

//[GET] admin/my-account/edit
module.exports.edit = async (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/my-account/edit.pug`, {
        pageTitle : "Chỉnh sửa thông tin cá nhân"
    });
};

//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    if (req.body.password) {
        req.body.password = md5(req.body.password);
    }
    else 
    {
        delete req.body.password;
    }

    await Account.updateOne({
        _id : id
    },req.body);

    res.redirect("back");
}
