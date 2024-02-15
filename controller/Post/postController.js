const postModel = require("../../models/postModel");
const userModel = require('../../models/userModel.js')
const validateAddPost = require("../../joiSchemas/Post/postSchema");
const { cloudinary } = require('../../utils/cloudinary/cloudinary.js')


// Function to upload a file to Cloudinary
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


//   try {
//     const { post } = req.body;

//     if (!post) {
//       return res
//         .status(400)
//         .json({ statusCode: 400, message: "Post content is required" });
//     }

//     if (req.file) {
//       console.log("Uploaded file:", req.file);

//       const userEmail = req.userEmail;

//       // configured cloudinary
//       const cloudinaryStream = cloudinary.uploader.upload_stream(async (error, result) => {
//         if (error) {
//           console.error("Error in Cloudinary upload:", error);
//           return res
//             .status(500)
//             .json({
//               statusCode: 500,
//               message: "Internal server error",
//               error: error.message,
//             });
//         }

//         if (!result) {
//           console.error("Cloudinary did not return a result");
//           return res
//             .status(500)
//             .json({
//               statusCode: 500,
//               message: "Internal server error",
//               error: "Cloudinary did not return a result",
//             });
//         }

//         console.log("Cloudinary Response:", result);

//         const postAdd = await postModel.create({
//           email: userEmail,
//           post,
//           images: [result.secure_url],
//         });

//         return res.status(201).json({
//           statusCode: 201,
//           message: "Post added successfully",
//           postAdd,
//         });
//       });

//       // Pipe the buffer to Cloudinary
//       const bufferStream = new Readable();
//       bufferStream.push(req.file.buffer);
//       bufferStream.push(null);
//       bufferStream.pipe(cloudinaryStream);
//     } else {
//       return res
//         .status(400)
//         .json({ statusCode: 400, message: "Image file is required" });
//     }
//   } catch (error) {
//     console.error("Error in adding post:", error);
//     return res
//       .status(500)
//       .json({
//         statusCode: 500,
//         message: "Internal server error",
//         error: error.message,
//       });
//   }
// };

const myPost = async (req, res) => {
  try {
    const userEmail = req.userEmail; // Access user email from the request object

    const postData = await postModel.findAll({
      where: { email: userEmail },
    });



    const userData = await userModel.findByPk(userEmail)


    const data = postData.map((post) => {
      return {
        ...post.dataValues,
        images: JSON.parse(post.dataValues.images),
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePic: userData.profilePic
        }
      };
    });



    return res
      .status(200)
      .json({ statusCode: 200, message: "All posts fetched", data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const addingPost = async (req, res) => {
  try {
    const { error, value: { postText } } = validateAddPost(req.body)
    if (error) return res.status(400).send(error.message)


    // if (!req.files || req.files.length === 0) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     message: "Image files are required",
    //   });
    // }
    // decoded the user email from the middleware
    const userEmail = req.userEmail;

    // Process each uploaded file
    const imageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const cloudinaryResponse = await uploadToCloudinary(file);
        if (cloudinaryResponse.error) {
          return res.status(500).json({
            statusCode: 500,
            message: "Internal server error during image upload",
            error: cloudinaryResponse.error.message,
          });
        }

        imageUrls.push(cloudinaryResponse.secure_url);
      }
    }

    // Create post in the database with image URLs
    const postAdd = await postModel.create({
      email: userEmail,
      postText,
      images: imageUrls,
    });

    const user = await userModel.findByPk(userEmail);


    return res.status(201).json({
      statusCode: 201,
      message: "Post added successfully",
      postAdd: {
        ...postAdd.dataValues,
        images: JSON.parse(postAdd.dataValues.images),
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePic
        }
      },
    });
  } catch (error) {
    console.error("Error in adding post:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const allPosts = async (req, res) => {
  try {
    const postData = await postModel.findAll();

    if (postData.length === 0) return res
      .status(200)
      .json({ statusCode: 200, message: "No Post Found", data: postData })

    const data = await Promise.all(postData.map(async (post) => {
      const userData = await userModel.findByPk(post.email);
      return {
        ...post.dataValues,
        images: JSON.parse(post.dataValues.images),
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePic: userData.profilePic
        }
      };
    }));
    console.log(data);
    return res
      .status(200)
      .json({ statusCode: 200, message: "All posts fetched", data });
  } catch (error) {
    return res.status('500').send('Server Error')
  }
}

const delPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.findByPk(postId)
    if (!post) return res.status(404).send('Post not found')

    const userEmail = req.userEmail;
    if (post.email !== userEmail) return res.status(401).send("No Persmission to Delete Post")

    await post.destroy();

    return res.send('post deleted')
  } catch (error) {
    return res.status(500).send('Server Error')
  }
}

module.exports = { addingPost, myPost, allPosts, delPost };

