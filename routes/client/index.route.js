const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const chatRoutes = require("./chat.route");
const userRoutes = require("./user.route");
const userMiddleware = require("../../middleware/client/user.middleware");
const authMiddleware = require("../../middleware/client/auth.middleware");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);

    app.use("/", homeRoutes);

    app.use("/products", productRoutes);

    app.use("/chat", authMiddleware.authRequire, chatRoutes);

    app.use("/users", authMiddleware.authRequire, usersRoutes);

    app.use("/rooms-chat", authMiddleware.authRequire, roomsChatRoutes);

    app.use("/user", userRoutes);
}