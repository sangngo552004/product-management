const configSystem = require("../../config/system");
const PATH_ADMIN = configSystem.prefixAdmin;
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const generateHelper = require("../../helpers/generate.helper");
const md5 = require('md5');

//[GET] admin/accounts
module.exports.index = async (req, res) => {
    //find
    const find = {
        deleted : false
    }
    //end find

    const records = await Account.find(find);

    for (const record of records) {
        const role = await Role.findOne({
            _id : record.role_id
        });
        record.role = role;
    }

    res.render(`${PATH_ADMIN}/pages/accounts/index.pug`, {
        pageTitle : "Danh sách tài khoản",
        records : records
    });
}

//[GET] admin/accounts/create
module.exports.create = async (req, res) => {
    
    const roles = await Role.find({
        deleted : false
    })
    res.render(`${PATH_ADMIN}/pages/accounts/create.pug`, {
        pageTitle : "Tạo mới tài khoản",
        roles : roles
    });
}

//[POST] admin/accounts/create
module.exports.createPost = async (req, res) => {
    try{
        req.body.token = generateHelper.generateRandomString(30);
        req.body.password = md5(req.body.password);
    
        const account = new Account(req.body);
        await account.save();
    
        req.flash("success", "Tạo mới tài khoản thành công!");
    }
    catch(error) {
        req.flash("error","Tạo mới tài khoản thất bại!");
    }
    res.redirect(`/${configSystem.prefixAdmin}/accounts`);

}

//[GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await Account.findOne({
            _id : id,
            deleted : false
        })
        const roles = await Role.find({
            deleted : false
        })
        res.render(`${PATH_ADMIN}/pages/accounts/edit.pug`, {
            pageTitle : "Chỉnh sửa tài khoản",
            roles : roles,
            data: data
        });
    }catch(error){
        res.redirect(`/${configSystem.prefixAdmin}/accounts`);
    }
}

//[PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try{
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }
        else {
            delete req.body.password;
        }
        await Account.updateOne({
            _id : req.params.id
        },req.body);
        req.flash("success", "Cập nhật sản phẩm thành công!");
        res.redirect("back");
    }
    catch(error){
        req.flash("error","Cập nhật sản phẩm không thành công!");
        res.redirect(`/${configSystem.prefixAdmin}/accounts`);
    }
}
