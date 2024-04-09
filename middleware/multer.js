const multer = require("multer");
const path = require("path");

const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

// Multer configuration for handling multiple files and limiting size
const storage = multer.memoryStorage();
const allowedImageExtensions = [".png", ".jpeg", ".jpg"];

const uploadMultiple = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith("image/") && allowedImageExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not supported. Please upload a valid image file. ${allowedImageExtensions}`), false);
    }
  },
}); // Allow up to 10 files with the field name "images"

const uploadSingle = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith("image/") && allowedImageExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported. Please upload a valid image file."), false);
    }
  },
})


// yay create kia is ko add kr k daikh lo aik dfa
const handleMulterUpload = (fieldName, isSingle, maxImagesInMultiple) => {
  let upload;
  if (isSingle) upload = uploadSingle.single(fieldName);
  else upload = uploadMultiple.array(fieldName, maxImagesInMultiple)

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("Multer Error:", err);
        return res.status(400).json({
          statusCode: 400,
          message: "File upload error",
          error: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          statusCode: 400,
          error: err.message,
        });
      }

      // Check if files are missing in the request
      if (!isSingle) {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            statusCode: 400,
            message: `Missing required parameter ${fieldName}`,
          });
        }
      } else {
        if (!req.file) {
          return res.status(400).json({
            statusCode: 400,
            message: `Missing required parameter ${fieldName}`,
          });
        }
      }

      next();
    });
  };
  const hanldeSinleUpload = (req, res, next) => {
    // const uploadProfile = uploadSingle.single('profilePic');
    uploadProfile(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific error
        console.log("Multer Error:", err);
        return res.status(400).json({
          statusCode: 400,
          message: "File upload error",
          error: err.message,
        });
      } else if (err) {
        // Generic error
        console.log("Error:", err);
        return res.status(500).json({
          statusCode: 500,
          message: "Internal server error",
          error: err.message,
        });
      }

      // Check if files are missing in the request
      if (!req.file) {
        return res.status(400).json({
          statusCode: 400,
          message: `Missing required parameter ${fieldName}`,
        });
      }

      console.log("File Uploaded Successfully!");
      next();
    });
  }
}

// Middleware to handle file upload
const handleFileUpload = (req, res, next) => {
  const upload = uploadMultiple.array('images', 10)
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific error
      console.log("Multer Error:", err);
      return res.status(400).json({
        statusCode: 400,
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      // Generic error
      return res.status(400).json({
        statusCode: 400,
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

    // console.log("Files Uploaded Successfully!");
    next();
  });
};


const bufferToString = (req) => {
  return parser.format('new', req.file.buffer)
}


module.exports = { handleFileUpload, handleMulterUpload, bufferToString };
