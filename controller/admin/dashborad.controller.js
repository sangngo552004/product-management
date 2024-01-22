const configSystem = require("../../config/system");

module.exports.index = (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/dashboard/index.pug`, {
        pageTitle : "Trang tổng quan"
    });
}