const express = require('express')
const { checkJWT } = require('../../middleware/authenticationMiddleware');
const { getAllStories, getStory, postStory, deleteStory, incrementView } = require('../../controller/Story/story');
const { handleStoryUpload } = require('../../middleware/multer');
const storyRouter = express.Router()

storyRouter.get('/', getAllStories)
storyRouter.get('/:id', getStory)
storyRouter.post('/', handleStoryUpload, postStory)
storyRouter.delete('/:id', deleteStory)
storyRouter.patch('/counter/:id', incrementView)


module.exports = storyRouter