const configSystem = require("../../config/system");
const Product = require("../../models/product.model");
const filterStatusHelpers = require("../../helpers/filter-status.helpers");
const systemConfig = require("../../config/system");
const paginationHelpers = require("../../helpers/pagination.helper");



//[GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        const filterStatus = filterStatusHelpers(req.query);
    

        const find = {
            deleted : false
            
        }
        if(req.query.status)    {
            find.status = req.query.status;
        }

        //search
        if(req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex; 
            
        }
        //end search

        //pagination
        const countProducts = await Product.countDocuments({
            deleted: false
        });
        const objPagination = paginationHelpers(4, req.query, countProducts);

        //end pagination
        const products =  await Product.find(find)
            .sort({
                position: "desc"
            })
            .limit(objPagination.limitItems)
            .skip(objPagination.skip);
        

        const PATH_ADMIN = configSystem.prefixAdmin;
        res.render(`${PATH_ADMIN}/pages/products/index.pug`, {
            pageTitle : "Danh sách sản phẩm",
            products : products,
            filterStatus : filterStatus,
            keyword : req.query.keyword,
            pagination : objPagination
        });

    }
    catch(error) { 
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);

    }
    
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne(
        {
            _id : req.params.id
        },
        {
            status : req.params.status
        }
    )
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    
    switch(type) {
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: { $in : ids}
            },{
                status: type
            })
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "delete-all":
            await Product.updateMany({
                _id: { $in : ids}
            },{
                deleted : true,
                deletedAt : new Date()
            })
            req.flash("success", "Xóa sản phẩm thành công!");
            break;
        case "change-position":
            for(const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne({
                    _id : id
                },{
                    position : position
                })
            }
            req.flash("success","Thay đổi vị trí thành công!");
            break;
        default:
            break;
    }
    res.redirect("back");
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
    
        // await Product.deleteOne({
        //   _id: id
        // });
    
        await Product.updateOne({
          _id: id
        }, {
          deleted: true,
          deletedAt: new Date()
        });
        req.flash("success", "Xóa sản phẩm thành công!");
      } catch (error) {
        console.log(error);
      }
      
      res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render(`${configSystem.prefixAdmin}/pages/products/create.pug`,{
        pageTitle : "Thêm mới sản phẩm"
    });
}

// [POST] /admin/products/create

module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    // console.log(req.file);
    // console.log(req.body);
    // if(req.file && req.file.filename) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Thêm mới sản phẩm thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);


}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id : id,
            deleted : false
        })
        console.log(product);
        res.render(`${systemConfig.prefixAdmin}/pages/products/edit.pug`,{
            pageTitle : "Chỉnh sửa sản phẩm",
            product : product
        })
    }
    catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        
        if(req.file && req.file.filename) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
    
        await Product.updateOne({
            _id: id,
            deleted: false
          }, req.body);
      
        req.flash("success", "Thêm mới sản phẩm thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }

}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id : id,
            deleted : false
        })
    
        res.render(`${systemConfig.prefixAdmin}/pages/products/detail`,{
            pageTitle : "Chi tiết sản phẩm",
            product : product
        })
    }
    catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}