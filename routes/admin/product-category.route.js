const express = require("express");
const route = express.Router();
const multer = require("multer");

const upload = multer();



const controller = require("../../controller/admin/product-category.controller");
const validates = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

route.get("/", controller.index);

route.get("/create", controller.create);

route.post(
        "/create",
        upload.single("thumbnail"),
        uploadCloud.uploadSingle,
        validates.createPost,
        controller.createPost
);

route.get("/edit/:id", controller.edit);

route.patch(
        "/edit/:id",
        upload.single("thumbnail"),
        uploadCloud.uploadSingle,
        validates.createPost,
        controller.editPatch
)

module.exports = route;