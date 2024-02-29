const productRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const configSystem = require("../../config/system");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");

module.exports = (app) => {
    const PATH_ADMIN = `/${configSystem.prefixAdmin}`
    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);

    app.use(`${PATH_ADMIN}/products`, productRoutes);

    app.use(`${PATH_ADMIN}/products-category`, productCategoryRoutes);

    app.use(`${PATH_ADMIN}/roles`, roleRoutes);

    app.use(`${PATH_ADMIN}/accounts`, accountRoutes);
}