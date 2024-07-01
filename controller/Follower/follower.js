const {
  validateCreateFollower,
  validateUpdateFollowStatus,
} = require("../../joiSchemas/Follower/follower");
const followerModel = require("../../models/followerModel");
const userModel = require("../../models/userModel");
const { responseObject } = require("../../utils/responseObject");
const { Op } = require("sequelize");

const modifyData = async (followers, isUserReq) => {
  try {
    const data = await Promise.all(
      followers.map(async (follower) => {
        try {
          const userEmail = isUserReq
            ? follower.dataValues.userEmail
            : follower.dataValues.followingEmail;
          const userData = await userModel.findByPk(userEmail);
          if (!userData) return {};
          const { firstName, lastName, profilePic, email, coverPic } = userData;
          return {
            ...follower.dataValues,
            user: {
              firstName,
              lastName,
              profilePic,
              email,
              coverPic,
            },
          };
        } catch (error) {}
      })
    );
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return data ? data : [];
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("server Error", 500, "", "server Error"));
  }
};

const getAll = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    let data;
    if (Object.keys(req.query).length > 0) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      data = await followerModel.findAll({
        where: {
          userEmail,
        },
        limit,
        offset,
      });
    } else {
      data = await followerModel.findAll({
        where: {
          userEmail,
        },
      });
    }
    data = await modifyData(data, true);
    return res.send(responseObject("successfully", 200, data));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Internal Server Error"));
  }
};

const getAllFollower = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    let followerData;
    if (Object.keys(req.query).length > 0) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      followerData = await followerModel.findAll({
        where: {
          followingEmail: userEmail,
          status: "accepted",
        },
        limit,
        offset,
      });
    } else {
      followerData = await followerModel.findAll({
        where: {
          followingEmail: userEmail,
          status: "accepted",
        },
      });
    }
    const data = await modifyData(followerData, true);
    return res.status(200).send(responseObject("all Followers", 200, data));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

const getAllFollowing = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    let followingData;
    if (Object.keys(req.query).length > 0) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      followingData = await followerModel.findAll({
        where: {
          userEmail: userEmail,
          status: "accepted",
        },
        limit,
        offset,
      });
    } else {
      followingData = await followerModel.findAll({
        where: {
          userEmail: userEmail,
          status: "accepted",
        },
      });
    }
    const data = await modifyData(followingData, false);
    return res.status(200).send(responseObject("all Following", 200, data));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

const getASpeceficFollower = async (req, res) => {
  try {
    const id = req.params.id;
    const follower = await followerModel.findOne({
      where: {
        followerId: id,
        status: "accepted",
      },
    });
    if (!follower)
      return res
        .status(404)
        .send(
          responseObject("Follower Not Found", 404, data, "Follower Not Found")
        );
    return res.status(200).send(responseObject("all Following", 200, follower));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

const createAFollowRequest = async (req, res) => {
  try {
    const { error, value } = validateCreateFollower(req.body);
    if (error)
      return res
        .status(400)
        .send(responseObject(error.message, 400, "", error.message));
    const userEmail = req.userEmail;
    if (userEmail === value.followingEmail)
      return res
        .status(400)
        .send(
          responseObject(
            "Following Email and User Email cant be same",
            400,
            "",
            "Following Email and User Email cant be same"
          )
        );
    const validateFollowingUser = await userModel.findByPk(
      value.followingEmail
    );
    if (!validateFollowingUser)
      return res
        .status(400)
        .send(
          responseObject(
            "Following User Not Found",
            400,
            "",
            "Following User Not Found"
          )
        );
    let follower = await followerModel.findOne({
      where: {
        userEmail,
        followingEmail: value.followingEmail,
      },
    });
    if (follower && follower.status === "pending")
      return res
        .status(400)
        .send(
          responseObject(
            "Request is already Sent",
            400,
            "",
            "Request is already Sent"
          )
        );
    if (follower)
      return res
        .status(400)
        .send(
          responseObject(
            "You are already Following",
            400,
            "",
            "You are already Following"
          )
        );
    follower = await followerModel.create({ ...value, userEmail });
    return res
      .status(201)
      .send(responseObject("Follower Request Sent", 201, follower));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

const deleteAFollower = async (req, res) => {
  try {
    const email = req.params.email;
    const follower = await followerModel.findOne({
      where: {
        userEmail: email,
        followingEmail: req.userEmail,
      },
    });
    if (!follower)
      return res
        .status(404)
        .send(
          responseObject("Follower not Found", 404, "", "Follower not Found")
        );
    await follower.destroy();
    return res.send({
      message: "Follower Deleted Successfully",
      status: 200,
      data: follower,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject(error, 500, "", error));
  }
};

const deleteAFollowing = async (req, res) => {
  try {
    const email = req.params.email;
    const follower = await followerModel.findOne({
      where: {
        userEmail: req.userEmail,
        followingEmail: email,
      },
    });
    if (!follower)
      return res
        .status(404)
        .send(
          responseObject(
            "Following User not Found",
            404,
            "",
            "Following User not Found"
          )
        );
    await follower.destroy();
    return res.send({
      message: "Following Deleted Successfully",
      status: 200,
      data: follower,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(responseObject(error, 500, "", error));
  }
};

const updateStatusOfFollower = async (req, res) => {
  try {
    const id = req.params.id;
    const userEmail = req.userEmail;
    const { error, value } = validateUpdateFollowStatus(req.body);
    if (error)
      return res
        .status(400)
        .send(responseObject(error.message, 400, "", error.message));
    const email = value.email;
    const status = value.status;
    const data = await followerModel.findOne({
      where: {
        followerId: id,
        followingEmail: userEmail,
        userEmail: email,
        status: "pending",
      },
    });
    if (!data)
      return res
        .status(404)
        .send(responseObject("Not Found", 404, "", "Not Found"));
    if (status === "rejected") await data.destroy();
    await data.update({
      status,
    });
    // const user=await userModel.findByPk(data.)
    if (status === "rejected")
      return res
        .status(200)
        .send(responseObject("Request Rejected", 200, { ...data.dataValues }));
    else
      res
        .status(200)
        .send(
          responseObject("Request Accepted Successfully", 200, {
            ...data.dataValues,
          })
        );
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

const getAllFollowRequests = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const requests = await followerModel.findAll({
      where: {
        followingEmail: userEmail,
        status: "pending",
      },
    });
    const data = await modifyData(requests, true);
    return res
      .status(200)
      .send(responseObject("All Requests Received", 200, data));
  } catch (error) {
    return res
      .status(500)
      .send(responseObject("Server Error", 500, "", "Server Error"));
  }
};

module.exports = {
  getAllFollower,
  getASpeceficFollower,
  createAFollowRequest,
  deleteAFollowing,
  deleteAFollower,
  getAllFollowRequests,
  updateStatusOfFollower,
  getAllFollowing,
  getAll,
};
