const productRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const configSystem = require("../../config/system");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const myAccountRoutes = require("./my-account.route");
const authRoutes = require("./auth.route");
const authMiddleware = require("../../middleware/admin/auth.middleware");

module.exports = (app) => {
    const PATH_ADMIN = `/${configSystem.prefixAdmin}`
    app.use(`${PATH_ADMIN}/dashboard`,
            authMiddleware.authRequire,
            dashboardRoutes
        );

    app.use(`${PATH_ADMIN}/products`,
            authMiddleware.authRequire,
            productRoutes
        );

    app.use(`${PATH_ADMIN}/products-category`,
            authMiddleware.authRequire, 
            productCategoryRoutes
        );

    app.use(`${PATH_ADMIN}/roles`,
            authMiddleware.authRequire,
            roleRoutes
        );

    app.use(`${PATH_ADMIN}/accounts`,
            authMiddleware.authRequire, 
            accountRoutes
        );
    app.use(`${PATH_ADMIN}/my-account`,
            authMiddleware.authRequire, 
            myAccountRoutes
        );
    app.use(`${PATH_ADMIN}/auth`, authRoutes);
}