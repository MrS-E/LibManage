const {GridFsStorage} = require('multer-gridfs-storage')
const config = require("./config");

module.exports = new GridFsStorage({
    url: config.mongodbUri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
})