const configSystem = require("../../config/system");
const User = require("../../models/user.model");

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
        })

        if (!user) {
            res.redirect(`/user/login`);
            return;
        }
        next();
    }catch(error) {
        res.redirect(`/user/login`);
    }
}