
const multer = require("multer");

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (allowedImageTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Upload a JPG, PNG, WEBP, or GIF image.")
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

module.exports = upload;
