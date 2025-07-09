const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid mimetype');
        cb(error, 'images');
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(" ").join("_");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "_" + Date.now() + "." + ext);
    }
});

module.exports = storage;