const cron = require('node-cron');
const storiesModel = require('../../models/storiesModel');
const { Op } = require('sequelize');

const deleteOldStories = async () => {
    try {
        const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

        // Find stories older than 24 hours
        const oldStories = await storiesModel.findAll({
            where: {
                createdAt: {
                    [Op.lt]: twentyFourHoursAgo,
                },
            },
        });

        // Delete the found stories
        for (const story of oldStories) {
            await story.destroy();
            console.log(`Deleted story with ID ${story.storyId}`);
        }

        console.log('Deletion process completed.');
    } catch (error) {
        console.error('Error deleting old stories:', error);
    }
};


const startCron = () => {
    cron.schedule('0 * * * *', () => {
        deleteOldStories();
        console.log('Running a task every hour');
        // Add your task logic here
    });
}
startCron()



module.exports = { deleteOldStories }
