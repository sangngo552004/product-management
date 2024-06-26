const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

const controller = require("../../controller/admin/settings-general.controller");

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.uploadSingle,
  controller.generalPatch
);

module.exports = router;