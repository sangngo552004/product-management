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

//[GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await Role.findOne({
            _id : req.params.id,
            deleted : false
        })
        const PATH_ADMIN = configSystem.prefixAdmin;
        res.render(`${PATH_ADMIN}/pages/roles/edit.pug`, {
            pageTitle : "Chỉnh sửa nhóm quyền",
            data : data
        });
    }
    catch(err) {
        res.redirect(`/${configSystem.prefixAdmin}/roles`);
    }
}
//[PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({
            _id : req.params.id,
            deleted : false
        }, req.body);
    
        req.flash("success", "Chỉnh sửa nhóm quyền thành công");
    
        res.redirect(`back`);
    }
    catch(err) {
        res.redirect(`/${configSystem.prefixAdmin}/roles`);
    }
}

//[GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted : false
    })

    res.render("admin/pages/roles/permissions", {
        pageTitle : "Phân quyền",
        records : records
    })
}

//[PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const roles = JSON.parse(req.body.roles);
    try{
        for(const item of roles) {
            await Role.updateOne({
                _id : item.id,
            },{
                permissions : item.permissions
            });
        }
        req.flash("success", "Cập nhật phân quyền thành công!");
    }catch(error) {
        req.flash("error", "Cập nhật phân quyền không thành công!")
    }
    res.redirect("back");
}