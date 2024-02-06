const userModel = require("../../models/userModel");
const postModel = require("../../models/postModel");
const likePostModel = require("../../models/likepostModel");
const validateLike = require("../../joiSchemas/Like/likeSchema");

const likePost = async (req, res) => {

  const { error, value: { likePostID } } = validateLike(req.body)
  if (error) return res.status(400).send(error.message)

  const likeUserEmail = req.userEmail;

  // checks
  if (!likePostID || !likeUserEmail) {
    return res.status(400).json({
      statusCode: 400,
      message: "likePostID or likeUserEmail is missing",
    });
  }

  try {
    const userExist = await userModel.findOne({
      where: { email: likeUserEmail },
    });

    if (!userExist) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not found" });
    }

    const postExist = await postModel.findOne({
      where: { postID: likePostID },
    });

    if (!postExist) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "post not found" });
    }

    // Check if the user has already liked the post
    const existingLike = await likePostModel.findOne({
      where: {
        liker_email: likeUserEmail,
        PostID: likePostID,
      },
      attributes: ['id', 'liker_email', 'PostID', 'isLiked', 'createdAt', 'updatedAt'], // Specify the attributes to include
    });

    if (existingLike) {
      // If the user has already liked the post, toggle isLiked
      await likePostModel.update(
        { isLiked: !existingLike.isLiked },
        {
          where: {
            liker_email: likeUserEmail,
            PostID: likePostID,
          },
        }
      );

      const updatedLike = await likePostModel.findOne({
        where: {
          liker_email: likeUserEmail,
          PostID: likePostID,
        },
        attributes: ['id', 'liker_email', 'PostID', 'isLiked', 'createdAt', 'updatedAt'], // Specify the attributes to include
      });

      const toggleAction = existingLike.isLiked ? "disliked" : "liked";
      return res
        .status(200)
        .json({
          statusCode: 200,
          message: `Successfully ${toggleAction} the post`,
          data: updatedLike, // Include the updated data in the response
        });
    } else {
      // If the user has not liked the post, like it
      const addLike = await likePostModel.create({
        liker_email: likeUserEmail,
        PostID: likePostID,
        isLiked: true,
      });

      return res
        .status(200)
        .json({ statusCode: 200, message: "liked the post", data: addLike });
    }
  } catch (error) {
    console.error("Internal server error - likePost Controller", error);
    return res
      .status(500)
      .json({
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};


module.exports = { likePost };