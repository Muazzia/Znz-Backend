const cloudinary = require("cloudinary").v2;



cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_Api_key,
    api_secret: process.env.cloud_Api_Secret_key,
});

module.exports = { cloudinary }