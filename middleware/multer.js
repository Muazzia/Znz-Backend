const multer = require("multer");
const path = require("path");

// Multer configuration for handling multiple files and limiting size
const storage = multer.memoryStorage();
const allowedImageExtensions = [".png", ".jpeg", ".jpg"];

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith("image/") && allowedImageExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported. Please upload a valid image file."), false);
    }
  },
}).array("images", 10); // Allow up to 10 files with the field name "images"

// Middleware to handle file upload
const handleFileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific error
      console.error("Multer Error:", err);
      return res.status(400).json({
        statusCode: 400,
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      // Generic error
      console.error("Error:", err);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        error: err.message,
      });
    }

    // Check if files are missing in the request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Missing required parameter - images",
      });
    }

    console.log("Files Uploaded Successfully!");
    next();
  });
};

module.exports = { handleFileUpload };
