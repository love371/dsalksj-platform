const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Store uploads directly in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "dsalksj-posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  })
});

const upload = multer({ storage });

module.exports = upload;