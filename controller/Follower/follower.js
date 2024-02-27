const { validateCreateFollower, validateUpdateFollowStatus } = require('../../joiSchemas/Follower/follower');
const followerModel = require('../../models/followerModel');
const userModel = require('../../models/userModel');


const getAllFollower = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const followers = await followerModel.findAll({
            where: {
                userEmail,
                status: 'accepted'
            }
        });


        return res.send({ message: 'all Followers', staus: 200, data: followers })
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

const createAFollower = async (req, res) => {
    try {
        const { error, value } = validateCreateFollower(req.body)
        if (error) return res.status(400).send(error.message)

        const userEmail = req.userEmail;

        const validateFollowingUser = await userModel.findByPk(value.followingEmail)
        if (!validateFollowingUser) return res.status(404).send('Following User Not Found')

        let follower = await followerModel.findOne({
            where: {
                userEmail,
                followingEmail: value.followingEmail,
                status: 'accepted'
            }
        })

        if (follower) return res.status(400).send('Follower Already Exist')

        follower = await followerModel.create({ ...value, userEmail })
        return res.status(201).send({ message: "Follower Created", status: 201, data: follower })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const deleteAFollower = async (req, res) => {
    try {
        const id = req.params.id;

        const follower = await followerModel.findOne({
            where: {
                followerId: id,
                userEmail: req.userEmail
            }
        });
        if (!follower) return res.status(404).send('Follower not Found')

        await follower.destroy();
        return res.send({
            message: "Deleted Successfully",
            status: 200,
            data: follower
        })

    } catch (error) {
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


        res.status(200).send({ message: "Status Updated Successfully", status: 200, data })
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const getAllFollowRequests = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const data = await followerModel.findAll({
            where: {
                followingEmail: userEmail,
                status: 'pending'
            }
        })

        if (!data) return res.status(404).send('Not Found');

        return res.send({ message: 'All Requests Received', status: 200, data })
    } catch (error) {
        return res.status(500).send('Serve Error')
    }
}

module.exports = { getAllFollower, getASpeceficFollower, createAFollower, deleteAFollower, getAllFollowRequests, updateStatusOfFollower }