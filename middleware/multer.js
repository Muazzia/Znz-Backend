const multer = require("multer");
const path = require("path");

const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

// Multer configuration for handling multiple files and limiting size
const storage = multer.memoryStorage();
const allowedImageExtensions = [".png", ".jpeg", ".jpg"];

const uploadMultiple = multer({
  storage: storage,
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

//the array brackets should be removed it was added due to the error of frontend in course module
const handleProductUpload = (req, res, next) => {
  const upload = uploadMultiple.array('images[]', 10)
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


//the array brackets should be removed it was added due to the error of frontend in course module
const handleCourseUpload = (req, res, next) => {
  const uploadCourse = uploadMultiple.array('images[]', 10);
  uploadCourse(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific error
      console.log("Multer Error:", err);

      return res.status(400).json({
        statusCode: 400,
        message: "Image upload error",
        error: err,
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

    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     message: "Missing required parameter - images",
    //   });
    // }

    console.log("File Uploaded Successfully!");
    next();
  });
}

const handleProfileUpload = (req, res, next) => {
  const uploadProfile = uploadSingle.single('profilePic');
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
        message: "Missing required parameter profilePic",
      });
    }

    console.log("File Uploaded Successfully!");
    next();
  });
}

const handleCoverUpload = (req, res, next) => {
  const uploadProfile = uploadSingle.single('coverPic');
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
        message: "Missing required parameter coverPic",
      });
    }

    console.log("File Uploaded Successfully!");
    next();
  });
}

const handleStoryUpload = (req, res, next) => {
  const uploadProfile = uploadSingle.single('storyPic');
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
      console.error("Error:", err);
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
        message: "Missing required parameter storyPic",
      });
    }

    console.log("File Uploaded Successfully!");
    next();
  });
}

const bufferToString = (req) => {
  return parser.format('new', req.file.buffer)
}


module.exports = { handleFileUpload, handleProductUpload, handleProfileUpload, bufferToString, handleCoverUpload, handleStoryUpload, handleCourseUpload };
