const configSystem = require("../../config/system");
const productCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree.helpers");

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
module.exports.create = async (req, res) => {
    const records = await productCategory.find({
        deleted : false
    })

    const newRecords = createTreeHelper(records, parentID = "");

    const PATH_ADMIN = configSystem.prefixAdmin;
    res.render(`${PATH_ADMIN}/pages/product-category/create.pug`, {
        pageTitle : "Thêm mới danh mục sản phẩm",
        records : newRecords
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

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await productCategory.findOne({
            _id : req.params.id,
            deleted : false
        })
        console.log(data);
        const records = await productCategory.find({
            deleted : false
        })
    
        const newRecords = createTreeHelper(records, parentID = "");
        
        const PATH_ADMIN = configSystem.prefixAdmin;
        res.render(`${PATH_ADMIN}/pages/product-category/edit.pug`, {
            pageTitle : "Chỉnh sửa danh mục sản phẩm",
            records : newRecords,
            data : data
        });
    }
    catch(err) {
        res.redirect(`/${configSystem.prefixAdmin}/products-category`);
    }
}

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (req.body.position == "") {
            const count = await productCategory.countDocuments();
            req.body.position = count + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        
        await productCategory.updateOne({
            _id : req.params.id,
            deleted : false
        }, req.body);
        
        req.flash("success", "Cập nhật danh mục sản phẩm thành công!");

        res.redirect(`/${configSystem.prefixAdmin}/products-category`);
    }
    catch(err) {
        res.redirect(`/${configSystem.prefixAdmin}/products-category`);
    }

}