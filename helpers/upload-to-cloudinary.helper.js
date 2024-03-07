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
let streamUpload = (buffer) => {
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

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.url;
}