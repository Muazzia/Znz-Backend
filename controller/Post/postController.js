const postModel = require("../../models/postModel");
const userModel = require('../../models/userModel.js')
const validateAddPost = require("../../joiSchemas/Post/postSchema");
const { uploadMultipleToCloudinary } = require('../../utils/cloudinary/cloudinary.js');
const postLikeModel = require("../../models/likepostModel.js");
const commentModel = require("../../models/commentModel.js");
const { responseObject } = require("../../utils/responseObject/index.js");


const modifyData = async (allPosts, isMyPosts) => {
  if (isMyPosts) {
    const userData = await userModel.findByPk(allPosts[0].dataValues.email);
    const data = await Promise.all(allPosts.map(async (post) => {
      try {
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

        const comments = await commentModel.findAll({
          where: {
            postId: post.postID
          }
        })
        // group the comments together on the basis of user
        const commentsModified = await Promise.all(comments.map(async (comment) => {
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
          comments: {
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
    return data ? data : []
  }
  const data = await Promise.all(allPosts.map(async (post) => {
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

      const comments = await commentModel.findAll({
        where: {
          postId: post.postID
        }
      })
      // group the comments together on the basis of user
      const commentsModified = await Promise.all(comments.map(async (comment) => {
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
        comments: {
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

  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return data ? data : []

}


const myPost = async (req, res) => {
  try {
    const userEmail = req.userEmail;

    const postData = await postModel.findAll({
      where: { email: userEmail },
    });

    if (postData.length === 0) return res
      .status(200)
      .json({ statusCode: 200, message: "All posts fetched", data: [] })

    const data = await modifyData(postData, true)

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

const singlePost = async (req, res) => {
  try {
    const id = req.params.id
    const post = await postModel.findByPk(id)
    if (!post) return res.status(404).send(responseObject("Post not found", 404, "", "Id is not valid"))
    return res.status(200).send(responseObject("Post found", 200, post, ""))
  } catch (error) {
    return res.status(500).send(responseObject("Server error", 500, "", "Interval server error"))
  }
}

const userPost = async (req, res) => {
  try {
    const userEmail = req.params.email

    const postData = await postModel.findAll({
      where: { email: userEmail },
    });

    if (postData.length === 0) return res
      .status(200)
      .json({ statusCode: 200, message: "All posts fetched", data: [] })

    const data = await modifyData(postData, true)

    return res
      .status(200)
      .json({ statusCode: 200, message: "All posts fetched", data });
  } catch (error) {
    return res.status(500).send('Server Error')
  }
}

const addingPost = async (req, res) => {
  try {
    const { error, value: { postText } } = validateAddPost(req.body)
    if (error) return res.status(400).send(error.message)


    const userEmail = req.userEmail;
    const chkUser = await userModel.findByPk(userEmail)
    if (!chkUser) return res.status(400).send('User not found')


    const imagesUploadResponse = await uploadMultipleToCloudinary(req.files, "post")
    if (!imagesUploadResponse.isSuccess) return res.status(500).send(responseObject("Image Uplaod Error", 500, "", imagesUploadResponse.error));

    const imageUrls = imagesUploadResponse.data

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
        likes: {
          count: 0,
          likes: []
        },
        comments: {
          count: 0,
          comments: []
        },
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

    const data = await modifyData(postData)

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
    console.log(postId);
    const post = await postModel.findByPk(postId)
    if (!post) return res.status(404).send('Post not found')

    const userEmail = req.userEmail;
    if (post.email !== userEmail) return res.status(401).send("No Persmission to Delete Post")

    // for (let image in post.images) {
    //   console.log(post.images[image]);
    //   const cloudinaryResponse = await deleteFromCloudinary(post.images[image])
    //   if (cloudinaryResponse.error) return res.status(500).send({ message: "Can't delete at the moment", status: 500 })
    // }


    await post.destroy();

    return res.send({ message: 'post deleted', status: 200, data: post })
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server Error')
  }
}

module.exports = { addingPost, myPost, allPosts, delPost, userPost, singlePost };

