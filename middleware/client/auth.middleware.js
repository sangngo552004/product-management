const configSystem = require("../../config/system");
const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");

module.exports.authRequire = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/user/login`);
        return;
    }

    try{
        const user = await User.findOne({
            tokenUser : req.cookies.tokenUser,
            deleted: false,
            status : "active"
        }).select("-password");

        if (!user) {
            res.redirect(`/user/login`);
            return;
        }else {
            const cart = await Cart.findOne({
                userId : user.id
            });
            res.locals.cart = cart;
            console.log(cart);
            res.locals.infoUser = user;
        }
        next();
    }catch(error) {
        res.redirect(`/user/login`);
    }
}