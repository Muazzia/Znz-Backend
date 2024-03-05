const { validateCreateFollower, validateUpdateFollowStatus } = require('../../joiSchemas/Follower/follower');
const followerModel = require('../../models/followerModel');
const userModel = require('../../models/userModel');
const { Op } = require('sequelize');



const modifyData = async (followers, isUserReq) => {
    try {
        const data = await Promise.all(followers.map(async (follower) => {
            try {
                const userEmail = isUserReq ? follower.dataValues.userEmail : follower.dataValues.followingEmail;
                const userData = await userModel.findByPk(userEmail)
                if (!userData) return {};

                const { firstName, lastName, profilePic, email, coverPic } = userData
                return {
                    ...follower.dataValues,
                    user: {
                        firstName,
                        lastName,
                        profilePic,
                        email,
                        coverPic
                    }
                }
            } catch (error) { }
        }))


        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return data ? data : []
    } catch (error) {
        return res.status(500).send('server Error')
    }
}

const getAllFollower = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const followers = await followerModel.findAll({
            where: {
                followingEmail: userEmail,
                status: 'accepted'
            }
        });

        const data = await modifyData(followers, true)
        return res.send({ message: 'all Followers', staus: 200, data })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const getAllFollowing = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const followers = await followerModel.findAll({
            where: {
                userEmail: userEmail,
                // status: 'accepted'
            }
        });

        const data = await modifyData(followers, false)
        return res.send({ message: 'all Following', staus: 200, data })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const getASpeceficFollower = async (req, res) => {
    try {
        const id = req.params.id;

        const follower = await followerModel.findOne({
            where: {
                followerId: id,
                status: 'accepted'
            }
        });
        if (!follower) return res.status(404).send('Follower Not Found')
        return res.send({ message: "Follower Received", status: 200, data: follower });
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const createAFollowRequest = async (req, res) => {
    try {
        const { error, value } = validateCreateFollower(req.body)
        if (error) return res.status(400).send(error.message)

        const userEmail = req.userEmail;

        if (userEmail === value.followingEmail) return res.status(400).send('Following Email and User Email cant be same')

        const validateFollowingUser = await userModel.findByPk(value.followingEmail)
        if (!validateFollowingUser) return res.status(404).send('Following User Not Found')

        let follower = await followerModel.findOne({
            where: {
                userEmail,
                followingEmail: value.followingEmail
            }
        })

        if (follower) return res.status(400).send({ status: 400, message: 'You are already Following' })

        follower = await followerModel.create({ ...value, userEmail })
        return res.status(201).send({ message: "Follower Request Sent", status: 201, data: follower })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const deleteAFollower = async (req, res) => {
    try {

        const email = req.params.email;

        const follower = await followerModel.findOne({
            where: {
                userEmail: email,
                followingEmail: req.userEmail,
            },
        });

        if (!follower) return res.status(404).send('Follower not Found')

        await follower.destroy();
        return res.send({
            message: "Follower Deleted Successfully",
            status: 200,
            data: follower
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)

    }
}

const deleteAFollowing = async (req, res) => {
    try {
        const email = req.params.email;

        const follower = await followerModel.findOne({
            where: {
                userEmail: req.userEmail,
                followingEmail: email,
            },
        });

        if (!follower) return res.status(404).send('Following User not Found')

        await follower.destroy();
        return res.send({
            message: "Following Deleted Successfully",
            status: 200,
            data: follower
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)

    }
}

const updateStatusOfFollower = async (req, res) => {
    try {
        const id = req.params.id;
        const userEmail = req.userEmail;

        const { error, value } = validateUpdateFollowStatus(req.body)
        if (error) return res.status(400).send(error.message)

        const email = value.email;
        const status = value.status

        const data = await followerModel.findOne({
            where: {
                followerId: id,
                followingEmail: userEmail,
                userEmail: email,
                status: 'pending'
            }
        })

        if (!data) return res.status(404).send('Not Found');

        if (status === 'rejected') await data.destroy()
        await data.update({
            status
        })

        // const user=await userModel.findByPk(data.)
        res.status(200).send({ message: "Status Updated Successfully", status: 200, data: { ...data.dataValues, } })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const getAllFollowRequests = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const requests = await followerModel.findAll({
            where: {
                followingEmail: userEmail,
                status: 'pending'
            }
        })

        const data = await modifyData(requests, true)
        return res.send({ message: 'All Requests Received', status: 200, data })
    } catch (error) {
        return res.status(500).send('Serve Error')
    }
}

module.exports = { getAllFollower, getASpeceficFollower, createAFollowRequest, deleteAFollowing, deleteAFollower, getAllFollowRequests, updateStatusOfFollower, getAllFollowing }