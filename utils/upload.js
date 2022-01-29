const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

const params = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(params);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "natours",
    },
});

const upload = multer({ storage: storage });

module.exports = {
    /**
     * Uploader function
     * @param {Buffer Object} file 
     */

    upload,

    /**
    * Delete files from Cloudinary.
    * Expects an array of public_ids
    * @param {<array>} files 
    */
    cloudinaryDelete: async (files) => {
        return new Promise(async (resolve, reject) => {
            return files.map(async public_id => {
                return await cloudinary.api.delete_resources(public_id, {}, async (err, res) => {
                    if (err) { console.log('cloudinary error', err); reject({ status: false }); }
                    resolve(res);
                });
            });
        });
    },

    checkUploadFileType: async (type) => {
        if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/gif' && type !== 'image/jpeg' && type !== 'application/octet-stream') {
            return 'invalidImageType';
        }
        return true;
    }
};