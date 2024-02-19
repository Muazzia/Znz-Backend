const cloudinary = require("cloudinary").v2;



cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_Api_key,
    api_secret: process.env.cloud_Api_Secret_key,
});

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        // Use the `upload` method from the Cloudinary SDK
        cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
                if (error) {
                    console.error("Error in Cloudinary upload:", error);
                    reject({ error });
                } else {
                    console.log("Cloudinary Response:", result);
                    resolve({ secure_url: result.secure_url });
                }
            })
            .end(file.buffer);
    });
};


module.exports = { cloudinary, uploadToCloudinary }