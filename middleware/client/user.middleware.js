const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser : req.cookies.tokenUser
        }).select("-password");

        if (user) {
            const cart = await Cart.findOne({
                userId : user.id
            });
            res.locals.cart = cart;
            res.locals.user = user;
        }
    }

    next();
}