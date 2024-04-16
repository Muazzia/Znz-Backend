const storiesModel = require('../../models/storiesModel');
const { uploadToCloudinary } = require('../../utils/cloudinary/cloudinary');

const userModel = require('../../models/userModel');
const followerModel = require('../../models/followerModel');
const storyViewModel = require('../../models/storiesViewModel');

const { Op } = require('sequelize');
const { responseObject } = require('../../utils/responseObject');



const includeObject = {
    include: [
        { model: userModel, attributes: ["email", "firstName", "lastName", "profilePic"] },
    ]
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

        let userStories = await storiesModel.findAll({
            where: {
                userEmail,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000), // createdAt >= 24 hours ago
                },
            },
            ...includeObject
        });

        userStories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))


        // add views
        userStories = await Promise.all(userStories.map(async (story) => {
            const storyViews = await storyViewModel.findAll({
                where: {
                    storyId: story.storyId,
                }
            });

            const viewers = await Promise.all(storyViews.map(async (view) => {
                const user = await userModel.findByPk(view.userEmail);
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePic,
                    email: user.email
                };
            }));

            return {
                ...story.toJSON(),
                view: {
                    noOfViews: storyViews.length,
                    viewers
                }
            }
        }));


        let friendsData = await followerModel.findAll({
            where: {
                userEmail,
                status: 'accepted'
            }
        })
        friendsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))



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

        const story = await storiesModel.findOne({
            where: {
                storyId: id,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000), // createdAt >= 24 hours ago
                }
            },
            ...includeObject
        })


        if (!story) return res.status(404).send(responseObject("Story Not Found", 404, "", "Story Not Found"))

        if (story.userEmail !== req.userEmail) return res.status(401).send(responseObject("Unauthorized Can't Access", 401, "", "Unauthorized Can't Access"))

        const storyViews = await storyViewModel.findAll({
            where: {
                storyId: req.params.id,
            }
        })


        const viewers = await Promise.all(storyViews.map(async (view) => {
            const user = await userModel.findByPk(view.userEmail);
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                profilePic: user.profilePic,
                email: user.email
            };;
        }));

        // story.noOfViews = storyViews.length;

        return res.send(responseObject("Successfully Retreived", 200, {
            ...story.toJSON(),
            view: {
                noOfViews: storyViews.length,
                viewers
            }
        }))
    } catch (error) {
        console.log(error);
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
        return res.status(200).send(responseObject("Successfully Created Story", 200, {
            ...story.toJSON(),
            view: {
                noOfViews: 0,
                views: []
            }
        }))
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

        const story = await storiesModel.findByPk(storyId)
        if (!story) return res.status(404).send('story not found')

        const user = await userModel.findByPk(req.userEmail)
        if (!user) return res.status(404).send('user not found')

        let storyView = await storyViewModel.findOne({
            where: {
                storyId: req.params.id,
                userEmail: req.userEmail
            }
        })

        // return res.status(201).send(responseObject("View Created", 201, storyView))

        if (storyView) return res.status(400).send(responseObject("View already Created", 400, "", "View already created with this email"))
        // let storyView = await storyViewModel
        storyView = await storyViewModel.create({
            storyId: req.params.id,
            userEmail: req.userEmail
        })


        // const newObject = await returnObjectWrapper(story, req.userEmail, 'patch')

        return res.status(201).send(responseObject("View Created", 201, storyView))
    } catch (error) {
        res.status(500).send(responseObject("Server Error", 500, "", "Internal Server Error"))
    }
}

module.exports = { getAllStories, getStory, postStory, deleteStory, incrementView }