const userModel = require("../../models/userModel");
const postModel = require("../../models/postModel");
const likePostModel = require("../../models/likepostModel");
const validateLike = require("../../joiSchemas/Like/likeSchema");

const likePost = async (req, res) => {

  const { error, value: { postId } } = validateLike(req.body)
  if (error) return res.status(400).send(error.message)

  const userEmail = req.userEmail;


  try {
    const userExist = await userModel.findOne({
      where: { email: userEmail },
    });

    if (!userExist) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "user not found" });
    }

    const postExist = await postModel.findOne({
      where: { postID: postId },
    });

    if (!postExist) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "post not found" });
    }

    // Check if the user has already liked the post
    const existingLike = await likePostModel.findOne({
      where: {
        userEmail,
        postId: postId,
      }
    });

    if (existingLike) {
      // If the user has already liked the post, toggle isLiked
      await likePostModel.update(
        { isLiked: !existingLike.isLiked },
        {
          where: {
            userEmail,
            postId: postId,
          },
        }
      );

      const updatedLike = await likePostModel.findOne({
        where: {
          userEmail,
          postId: postId,
        }
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
        userEmail,
        postId,
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