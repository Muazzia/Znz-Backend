const { validateCreateFollower } = require('../../joiSchemas/Follower/follower');
const followerModel = require('../../models/followerModel');


const getAllFollower = async (req, res) => {
    try {
        const userEmail = req.userEmail;

        const followers = await followerModel.findAll({
            where: {
                userEmail
            }
        });

        return res.send(followers)
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}


const getASpeceficFollower = async (req, res) => {
    try {
        const id = req.params.id;

        const follower = await followerModel.findByPk(id);
        if (!follower) return res.status(404).send('Follower Not Found')
        return res.send(follower);
    } catch (error) {
        return res.status(500).send('Server Error')
    }
}

const createAFollower = async (req, res) => {
    try {
        const { error, value } = validateCreateFollower(req.body)
        if (error) return res.status(400).send(error.message)

        const userEmail = req.userEmail;

        const follower = await followerModel.create({ ...value, userEmail })
        return res.status(201).send(follower)
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
            follower: follower
        })

    } catch (error) {
        return res.status(500).send(error)

    }
}

module.exports = { getAllFollower, getASpeceficFollower, createAFollower, deleteAFollower }