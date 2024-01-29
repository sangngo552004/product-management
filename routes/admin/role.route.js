const express = require("express");
const route = express.Router();
const multer = require("multer");

const upload = multer();



const controller = require("../../controller/admin/role.controller");
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

route.get("/", controller.index);



module.exports = route;