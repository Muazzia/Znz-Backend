const express = require('express')
const { getAllStories, getStory, postStory, deleteStory, incrementView } = require('../../controller/Story/story');
const { handleMulterUpload } = require('../../middleware/multer');
const storyRouter = express.Router()

storyRouter.get('/', getAllStories)
storyRouter.get('/:id', getStory)
storyRouter.post('/', handleMulterUpload("storyPic", true), postStory)
storyRouter.delete('/:id', deleteStory)
storyRouter.patch('/counter/:id', incrementView)


module.exports = storyRouter