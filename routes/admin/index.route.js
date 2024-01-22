const productRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const configSystem = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = `/${configSystem.prefixAdmin}`
    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);

    app.use(`${PATH_ADMIN}/products`, productRoutes);
}