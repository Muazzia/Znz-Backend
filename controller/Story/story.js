const { bufferToString } = require('../../middleware/multer');
const storiesModel = require('../../models/storiesModel');
const { cloudinary } = require('../../utils/cloudinary/cloudinary');

const getAllStories = async (req, res) => {
    try {
        const allStories = await storiesModel.findAll({
            where: {
                userEmail: req.userEmail,
                isDeleted: false
            }
        });

        return res.send(allStories)
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
        return res.send(story)
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

        return res.send(story)
    } catch (error) {
        return res.status(500).send('Server error')
    }
}

const deleteStory = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
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

        return res.status(200).send(story)
    } catch (error) {
        res.status(500).send('Server Error')
    }
}

module.exports = { getAllStories, getStory, postStory, deleteStory, incrementView }