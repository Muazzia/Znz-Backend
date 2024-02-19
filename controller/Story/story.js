const { bufferToString } = require('../../middleware/multer');
const storiesModel = require('../../models/storiesModel');
const { cloudinary } = require('../../utils/cloudinary/cloudinary');

const userModel = require('../../models/userModel')

const returnObjectWrapper = async (data, mail) => {
    const user = await userModel.findByPk(mail)
    if (!user) return {
        message: "404 user dont found"
    }
    return {
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic
        },
        data
    }
}

const getAllStories = async (req, res) => {
    try {
        const allStories = await storiesModel.findAll({
            where: {
                userEmail: req.userEmail,
                isDeleted: false
            }
        });

        const newObject = await returnObjectWrapper(allStories, req.userEmail)
        return res.send(newObject)
    } catch (error) {
        return res.status(500).send('Internal Server')
    }
}

const getStory = async (req, res) => {
    try {
        const id = req.params.id;
        const story = await storiesModel.findByPk(id);

        if (!story) return res.status(404).send('Not found')

        if (story.userEmail !== req.userEmail) return res.status(401).send("Unauthorized Can't Access")

        if (story.isDeleted) return res.status(404).send('Not Found')

        const newObject = await returnObjectWrapper(story, req.userEmail)
        return res.send(newObject)
    } catch (error) {
        res.status(500).send('Server error')
    }
}

const postStory = async (req, res) => {
    try {
        const imgResponse = await cloudinary.uploader.upload(bufferToString(req).content);
        const story = await storiesModel.create({
            userEmail: req.userEmail,
            storyImage: imgResponse.secure_url
        })

        if (!story) return res.status(400).send('Cant upload')


        const newObject = await returnObjectWrapper(story, req.userEmail)
        return res.send(newObject)
    } catch (error) {
        return res.status(500).send('Server error')
    }
}

const deleteStory = async (req, res) => {
    try {
        const id = req.params.id
        const story = await storiesModel.findOne({ where: { storyId: id, isDeleted: false } });

        if (!story) return res.status(404).send('Not found')

        await story.update({
            isDeleted: true
        });
        return res.send('Deleted Successfully')
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error')
    }
}

const incrementView = async (req, res) => {
    try {
        const storyId = req.params.id
        const story = await storiesModel.findOne({
            where: {
                userEmail: req.userEmail,
                storyId,
                isDeleted: false
            }
        })

        if (!story) return res.status(404).send('story not found')

        await story.update({
            noOfViews: story.noOfViews + 1
        })

        const newObject = await returnObjectWrapper(story, req.userEmail)
        return res.send(newObject)
    } catch (error) {
        res.status(500).send('Server Error')
    }
}

module.exports = { getAllStories, getStory, postStory, deleteStory, incrementView }