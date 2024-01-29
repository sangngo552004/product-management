const configSystem = require("../../config/system");
const Role = require("../../models/role.model");

//[GET] admin/roles/
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted : false
    })
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/roles/index.pug`, {
        pageTitle : "Trang nhóm quyền",
        records : records
    });
}
//[GET] admin/roles/create
module.exports.create = async (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/roles/create.pug`, {
        pageTitle : "Thêm mới nhóm quyền",
    });
}

//[POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const records = new Role(req.body);
    await records.save();

    req.flash("success", "Thêm mới nhóm quyền thành công");

    res.redirect(`/${configSystem.prefixAdmin}/roles`);
}