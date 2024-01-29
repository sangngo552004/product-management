const configSystem = require("../../config/system");

module.exports.index = (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/roles/index.pug`, {
        pageTitle : "Trang nhóm quyền"
    });
}