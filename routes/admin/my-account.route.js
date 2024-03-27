const express = require("express");
const route = express.Router();
const multer = require("multer");

const upload = multer();

const controller = require("../../controller/admin/my-account.controller");

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

route.get("/", controller.index);

route.get("/edit", controller.edit);

route.patch(
        "/edit",
        upload.single("avatar"),
        uploadCloud.uploadSingle,
        controller.editPatch
        )

module.exports = route;