const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../public/uploads/profiles');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `profile-${req.user.id}-${Date.now()}${extension}`);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        return callback(null, true);
    }

    const error = new Error('A foto de perfil deve ser uma imagem.');
    error.statusCode = 400;
    return callback(error);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
