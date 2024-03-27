const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
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
    try {
        const slug = req.params.slug;
    
        const product = await Product.findOne({
          slug: slug,
          deleted: false,
          status: "active"
        });
    
        console.log(product);
    
        res.render("client/pages/products/detail", {
          pageTitle: product.title,
          product: product
        });
      } catch (error) {
        res.redirect("/");
      }
}

//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug : slugCategory,
    status : "active",
    deleted : false
  });

  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });

    let allSubs = [...subs];

    for(const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  }

  const allCategory = await getSubCategory(category.id);

  const allCategoryId = allCategory.map(item => item.id);

  const products = await Product.find({
    product_category_id : {
      $in : [
        category.id,
        ...allCategoryId
      ]
    },
    status : "active",
    deleted : false
  }).sort({position : "desc"});

  for (const item of products) {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
  }


  res.render("client/pages/products/index", {
    pageTitle : "Danh sách sản phẩm",
    products : products
  });
}