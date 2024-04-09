const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_Api_key,
    api_secret: process.env.cloud_Api_Secret_key,
});


const uploadToCloudinary = (file, folderPath) => {
    const uploadOptions = {
        resource_type: "auto",
        folder: folderPath,
        quality: file.size > 2 * 1024 * 1024 ? 50 : 60, // Adjust the quality value as needed (default is 80)
    };

    // if folder path given to upload on the specific folder
    if (folderPath) {
        return new Promise((resolve, reject) => {
            // Use the `upload` method from the Cloudinary SDK
            cloudinary.uploader
                .upload_stream(uploadOptions, (error, result) => {
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
    }
    return new Promise((resolve, reject) => {
        // Use the `upload` method from the Cloudinary SDK
        cloudinary.uploader
            .upload_stream(uploadOptions, (error, result) => {
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

const deleteFromCloudinary = async (url) => {
    try {
        // console.log('exra', url.split('/'));
        const publicId = url.split('/').pop().split('.')[0];

        if (!publicId) {
            throw new Error('Error extracting public_id from URL');
        }
        console.log(publicId);

        // Delete the image using the public ID
        const result = await cloudinary.uploader.destroy(`${publicId}`);
        console.log('Image deleted successfully:', result);
        return { message: 'successfully' };
    } catch (error) {
        console.error('Error deleting image:', error);
        return { error };
    }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary }