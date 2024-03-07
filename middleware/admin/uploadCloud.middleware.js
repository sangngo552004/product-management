const uploadToCloudinary = require("../../helpers/upload-to-cloudinary.helper");

module.exports.uploadSingle = async (req, res, next) => {
    if (req.file) {
            
            req.body[req.file.fieldname] = await uploadToCloudinary(req.file.buffer);
    }
    next();
};