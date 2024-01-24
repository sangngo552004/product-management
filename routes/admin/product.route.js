const express = require("express");
const route = express.Router();
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');

// const storageMulter = require("../../helpers/storage-multer.helper");

// const upload = multer({ storage: storageMulter() });
//cloudinary
cloudinary.config({ 
        cloud_name: "dnxdaykpf",
        api_key: "828462918612732",
        api_secret: "J6ifO9wO3su9DC7U3j-94li2heU"
});
//end cloudinary

const upload = multer();



const controller = require("../../controller/admin/product.controller");
const validates = require("../../validates/admin/product.validate");

route.get("/", controller.index);

route.patch(
        "/change-status/:status/:id",
         controller.changeStatus
);

route.patch(
        "/change-multi",
        controller.changeMulti
);
route.delete(
        "/delete/:id",
        controller.deleteItem

);
route.get("/create", controller.create);

route.post(
        "/create",
        upload.single("thumbnail"),
        function (req, res, next) {
                if (req.file) {
                        let streamUpload = (req) => {
                                return new Promise((resolve, reject) => {
                                    let stream = cloudinary.uploader.upload_stream(
                                      (error, result) => {
                                        if (result) {
                                          resolve(result);
                                        } else {
                                          reject(error);
                                        }
                                      }
                                    );
                        
                                  streamifier.createReadStream(req.file.buffer).pipe(stream);
                                });
                        };
                        
                        async function upload(req) {
                                let result = await streamUpload(req);
                                req.body[req.file.fieldname] = result.url;
                                next();
                        }
                
                        upload(req);
                }
                else {
                        next();
                }
                
        },
        validates.createPost,
        controller.createPost
);

route.get("/edit/:id", controller.edit);

route.patch(
        "/edit/:id",
        upload.single("thumbnail"),
        validates.createPost,
        controller.editPatch
)

route.get("/detail/:id", controller.detail);


module.exports = route;