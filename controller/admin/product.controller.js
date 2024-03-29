const configSystem = require("../../config/system");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterStatusHelpers = require("../../helpers/filter-status.helpers");
const systemConfig = require("../../config/system");
const paginationHelpers = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/create-tree.helpers");



//[GET] /admin/products
module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes("products_view"))
    {
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
            

            //sort
            const sort = {};
            if (req.query.sortKey && req.query.sortValue) {
                sort[req.query.sortKey] = req.query.sortValue;
            }
            else {
                sort["position"] = "desc";
            }
            //end sort
            const products =  await Product.find(find)
                .sort(sort)
                .limit(objPagination.limitItems)
                .skip(objPagination.skip);
            
            for (const product of products) {
                const account = await Account.findOne({
                    _id : product.createdBy.accountId
                }).select("fullName");

                if (account) {
                    product.createdBy.fullName = account.fullName;
                }

            }
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
    else{
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }
    
    
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit"))
    {
        const objectUpdatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date(),
        };
        await Product.updateOne(
            {
                _id : req.params.id
            },
            {
                status : req.params.status,
                $push : {updatedBy : objectUpdatedBy}
            }
        )
        req.flash("success", "Cập nhật trạng thái thành công!");
        res.redirect("back");
    }
    else
    {
        req.flash("error", "Bạn không có quyền chỉnh sửa!");
        res.redirect("back");
    }  
    
    

}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    
        const ids = req.body.ids.split(", ");
        const type = req.body.type;
        const objectUpdatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date(),
        };
    
        switch(type) {
            case "active":
            case "inactive":
                await Product.updateMany({
                    _id: { $in : ids}
                },{
                    status: type,
                    $push : {updatedBy : objectUpdatedBy}
                })
                req.flash("success", "Cập nhật trạng thái thành công!");
                break;
            case "delete-all":
                await Product.updateMany({
                    _id: { $in : ids}
                },{
                    deleted : true,
                    deletedBy : {
                        accountId : res.locals.user.id,
                        deletedAt: new Date()
                    }
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
                        position : position,
                        $push : {updatedBy : objectUpdatedBy}
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
              deletedBy: {
                accountId : res.locals.user.id,
                deletedAt : new Date()
              }
            });
            req.flash("success", "Xóa sản phẩm thành công!");
          } catch (error) {
            console.log(error);
          }
          
          res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    if(res.locals.role.permissions.includes("products_create"))
    {
        const records = await ProductCategory.find({
            deleted : false
        })
        const newRecords = createTreeHelper(records, parentID = "");
        res.render(`${configSystem.prefixAdmin}/pages/products/create.pug`,{
            pageTitle : "Thêm mới sản phẩm",
            records : newRecords
        });
    }
    else if (res.locals.role.permissions.includes("products_view"))
    {
        req.flash("error","Bạn không có quyền thêm mới sản phẩm!");
        res.redirect(`/${configSystem.prefixAdmin}/products`);
    }
    else
    {
        res.redirect(`/${configSystem.prefixAdmin}/dashboard`);
    }
}

// [POST] /admin/products/create

module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products_create"))
    {
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
        req.body.createdBy = {
            accountId : res.locals.user.id,
            createdAt : new Date()
        }
        const product = new Product(req.body);
        await product.save();

        req.flash("success", "Thêm mới sản phẩm thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/products`);

    }
    else
    {
        res.send("403");
    }
    

}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit"))
    {
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                _id : id,
                deleted : false
            })
            
            const records = await ProductCategory.find({
                deleted: false,
              });
          
              const newRecords = createTreeHelper(records);
            res.render(`${systemConfig.prefixAdmin}/pages/products/edit.pug`,{
                pageTitle : "Chỉnh sửa sản phẩm",
                product : product,
                records : newRecords
            })
        }
        catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    }
    else if (res.locals.role.permissions.includes("products_view"))
    {
        req.flash("error","Bạn không có quyền thêm mới sản phẩm!");
        res.redirect(`/${configSystem.prefixAdmin}/products`);
    }
    else
    {
        res.redirect(`/${configSystem.prefixAdmin}/dashboard`);
    }
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit"))
    {
        try {
            const id = req.params.id;
    
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);
            
            if(req.file && req.file.filename) {
                req.body.thumbnail = `/uploads/${req.file.filename}`;
            }
            const objectUpdatedBy = {
                accountId: res.locals.user.id,
                updatedAt: new Date()
              };
            await Product.updateOne({
                _id: id,
                deleted: false
              }, {
                ...req.body,
                $push: { updatedBy: objectUpdatedBy }
              });
          
            req.flash("success", "Thêm mới sản phẩm thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
        catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    }
    else
    {
        res.send("403");
    }
    

}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    if(res.locals.role.permissions.includes("products_view"))
    {
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
    else
    {
        req.flash("error","Bạn không có quyền xem chi tiết sản phẩm!");
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }
}