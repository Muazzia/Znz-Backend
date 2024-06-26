const { DataTypes } = require('sequelize')

const sequelize = require('../database/connection');
const userModel = require('./userModel');

const courseModel = sequelize.define("courses", {
    courseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    parentCategory: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'courseparentcategories',
            key: "courseParentCategoryId"
        },
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
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
