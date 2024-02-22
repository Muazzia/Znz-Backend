const postModel = require("../../models/postModel");
const userModel = require('../../models/userModel.js')
const validateAddPost = require("../../joiSchemas/Post/postSchema");
const { cloudinary, uploadToCloudinary } = require('../../utils/cloudinary/cloudinary.js');
const postLikeModel = require("../../models/likepostModel.js");
const commentModel = require("../../models/commentModel.js");


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
      try {
        const userData = await userModel.findByPk(post.email);
        const likes = await postLikeModel.findAll({
          where: {
            postId: post.dataValues.postID
          }
        })

        // group likes together on the basis of users
        const likesModified = await Promise.all(likes.map(async l => {
          try {
            const user = await userModel.findByPk(l.dataValues.userEmail)
            const { firstName, lastName, profilePic, email } = user
            return {
              user: { firstName, lastName, profilePic, email },
              like: { ...l.dataValues }
            }
          } catch (error) { console.log('In post  error'); }
        }))

        const commnets = await commentModel.findAll({
          where: {
            postId: post.postID
          }
        })
        // group the comments together on the basis of user
        const commentsModified = await Promise.all(commnets.map(async (comment) => {
          try {
            const user = await userModel.findByPk(comment.dataValues.userEmail)
            const { firstName, lastName, profilePic, email } = user
            return {
              user: { firstName, lastName, profilePic, email },
              comment: { ...comment.dataValues }
            }
          } catch (error) { }
        }))

        return {
          ...post.dataValues,
          likes: {
            count: likesModified.length,
            likes: likesModified
          },
          commnets: {
            count: commentsModified.length,
            comments: commentsModified
          },
          images: JSON.parse(post.dataValues.images),
          user: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            profilePic: userData.profilePic,
            email: userData.email
          }
        };
      } catch (error) { }
    }));




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

