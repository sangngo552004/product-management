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

module.exports.uploadSingle = (req, res, next) => {
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
    
};