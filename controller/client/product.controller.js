const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted : false
    }).sort({
        position: "desc"
      });

    for(const item of products) {
        item.newPrice = (1 - item.discountPercentage/100) * item.price;
        item.newPrice = item.newPrice.toFixed(0);
    }

    res.render("client/pages/products/index.pug", {
        pageTitle : "Danh sách sản phẩm",
        products: products
    });
};
//[GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    const product = await Product.findOne({
        slug : slug,
        deleted : false,
        status : "active"
    })

    res.render("client/pages/products/detail", {
        pageTitle : "Chi tiết sản phẩm",
        product : product
    })
}