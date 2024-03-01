const configSystem = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.authRequire = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`/${configSystem.prefixAdmin}/auth/login`);
        return;
    }

    try{
        const user = await Account.findOne({
            token : req.cookies.token,
            deleted: false,
            status : "active"
        })

        if (!user) {
            res.redirect(`/${configSystem.prefixAdmin}/auth/login`);
            return;
        }
        next();
    }catch(error) {
        res.redirect(`/${configSystem.prefixAdmin}/auth/login`);
    }
}