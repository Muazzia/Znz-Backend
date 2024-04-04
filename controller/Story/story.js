const { bufferToString } = require('../../middleware/multer');
const storiesModel = require('../../models/storiesModel');
const { cloudinary, uploadToCloudinary } = require('../../utils/cloudinary/cloudinary');

const userModel = require('../../models/userModel');
const followerModel = require('../../models/followerModel');
const { Op } = require('sequelize');
const { responseObject } = require('../../utils/responseObject');

const returnObjectWrapper = async (data, mail, route) => {
    const messageData = {
        'get': "Stories Returned Successfully",
        'post': "Story Created Successfully",
        'delete': "Story Deleted Successfully",
        "patch": "Story Updated Successfully"
    }
    let message = messageData[route]

    const user = await userModel.findByPk(mail)
    if (!user) return {
        message: "404 user dont found"
    }
    return {
        message,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic
        },
        stories: data
    }
}

const includeObject = {
    include: [{ model: userModel, attributes: ["email", "firstName", "lastName", "profilePic"] }]
}

const getAllStories = async (req, res) => {
    try {
        const userEmail = req.userEmail
        const userData = await userModel.findByPk(userEmail, {
            attributes: {
                exclude: ['password']
            }
        })

        if (!userData) return res.status(404).send(responseObject("User not Found", 404, "", "User Not Found"))

        const userStories = await storiesModel.findAll({
            where: {
                userEmail,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000), // createdAt >= 24 hours ago
                },
            },
            ...includeObject
        });

        const friendsData = await followerModel.findAll({
            where: {
                userEmail,
                status: 'accepted'
            }
        })



        const FriendsEmails = friendsData.map(d => {
            return d.dataValues.followingEmail
        })
        const FriendsStories = await Promise.all(FriendsEmails.map(async (email, i) => {
            try {

                const user = await userModel.findByPk(email)
                if (!user) return null;
                const stories = await storiesModel.findAll({
                    where: {
                        userEmail: email,
                        createdAt: {
                            [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000),
                        },
                    },
                    ...includeObject
                });

                if (stories.length === 0) return null
                return {
                    user: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profilePic: user.profilePic
                    },
                    stories
                }

            } catch (error) { }
        }))

        const finalArr = FriendsStories.filter(t => {
            return t
        })

        const data = {
            user: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                profilePic: userData.profilePic
            },
            stories: userStories,
            friendsStories: finalArr
        }
        return res.status(200).send(responseObject("Successfully Retrieved", 200, data))
    } catch (error) {
        console.log(error);
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const getStory = async (req, res) => {
    try {
        const id = req.params.id;
        const story = await storiesModel.findByPk(id, {
            ...includeObject
        });

        if (!story) return res.status(404).send('Not found')

        if (story.userEmail !== req.userEmail) return res.status(401).send("Unauthorized Can't Access")

        return res.send(responseObject("Successfully Retreived", 200, story))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const postStory = async (req, res) => {
    try {
        if (!req.file) return res.status(400).send(responseObject("Please Upload Image", 400, "", "Image is Required"))
        const imgResponse = await uploadToCloudinary(req.file, "znz/stories")
        const user = await userModel.findByPk(req.userEmail)
        if (!user) return res.status(404).send(responseObject("User not Found", 404, "", "User Not Found"))

        let story = await storiesModel.create({
            userEmail: req.userEmail,
            storyImage: imgResponse.secure_url
        })

        if (!story) return res.status(400).send(responseObject("Error During Creation", 400, "", "Try Again"))

        story = await storiesModel.findByPk(story.storyId, {
            ...includeObject
        });
        return res.status(200).send(responseObject("Successfully Created Story", 200, story))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const deleteStory = async (req, res) => {
    try {
        const id = req.params.id
        const story = await storiesModel.findByPk(id, {
            ...includeObject
        });

        if (!story) return res.status(404).send(responseObject("Story not Found", 404, "", "Story Not Found"))

        await story.destroy();
        return res.send(responseObject("Deleted Successfully", 200, story))
    } catch (error) {
        return res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

const incrementView = async (req, res) => {
    try {
        const storyId = req.params.id
        const story = await storiesModel.findOne({
            where: {
                userEmail: req.userEmail,
                storyId,
            }
        })

        if (!story) return res.status(404).send('story not found')

        await story.update({
            noOfViews: story.noOfViews + 1
        })

        const newObject = await returnObjectWrapper(story, req.userEmail, 'patch')
        return res.send(newObject)
    } catch (error) {
        res.status(500).send('Server Error')
    }
}

module.exports = { getAllStories, getStory, postStory, deleteStory, incrementView }