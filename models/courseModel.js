const { DataTypes } = require('sequelize')

const sequelize = require('../database/connection')

const courseModel = sequelize.define("courses", {
    courseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    parentCategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subCategories: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue("images");
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue("images", value ? JSON.stringify(value) : null);
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mode: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['onsite', 'online']
    },
    courseDuration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    classDays: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    classDuration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseFee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: "email"
        },
        onDelete: "CASCADE"
    },
    // status: {
    //     type: DataTypes.ENUM,
    //     allowNull: false,
    //     values: ['pending', 'accepted', 'rejected']
    // },
})

sequelize
    .sync()
    .then(() => {
        console.log("courseModel synchronized with the database(znz).");
    })
    .catch((error) => {
        console.error("Error synchronizing courseModel", error);
    });


module.exports = courseModel
