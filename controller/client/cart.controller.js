const Cart = require("../../models/cart.model");

//[PORT] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    
    
    try {
        const cart = await Cart.findOne({
            userId: res.locals.user.id
        });
        
        const existProductInCart = cart.products.find(item => item.product_id == productId);
        console.log(existProductInCart)
        if(existProductInCart) {
            const quantityNew = existProductInCart.quantity + quantity;

            await Cart.updateOne({
                userId : res.locals.user.id,
                "products.product_id" : productId
            },{
                $set: { "products.$.quantity": quantityNew }
            });
        }
        else {
            const objectCart = {
                product_id: productId,
                quantity: quantity,
              };
        
              await Cart.updateOne(
                { userId: res.locals.user.id },
                {
                  $push: { products: objectCart },
                }
            );
        }

        req.flash("success","Đã thêm sản phẩm vào giỏi hàng!");
    }
    catch(error) {
        req.flash("error", `Thêm sản phẩm vào giỏ hàng không thành công!`);
    }
    res.redirect("back");
}