const configSystem = require("../../config/system");
const productCategory = require("../../models/product-category.model");

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    const records = await productCategory.find({
        deleted : false
    });
    res.render(`${PATH_ADMIN}/pages/product-category/index.pug`, {
        pageTitle : "Danh mục sản phẩm",
        records : records
    });
}

//[GET] /admin/products-category/create
module.exports.create =  (req, res) => {
    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/product-category/create.pug`, {
        pageTitle : "Thêm mới danh mục sản phẩm",
    });
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await productCategory.countDocuments();
        req.body.position = count + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new productCategory(req.body);
    await record.save();

    
    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");

    res.redirect(`/${configSystem.prefixAdmin}/products-category`);
}