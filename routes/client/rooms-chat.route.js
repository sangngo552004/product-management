const express = require("express");
const route = express.Router();

const controller = require("../../controller/client/rooms-chat.controller");

route.get("/", controller.index);

route.get("/create",controller.create);

route.post("/create", controller.createPost);

module.exports = route;