const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7f9b7e1d3c81234567890"
 *         name:
 *           type: string
 *           example: "Oleg"
 *         email:
 *           type: string
 *           format: email
 *           example: "oleg@gmail.com"
 *         password:
 *           type: string
 *           description: Хешированный пароль
 *           example: "$2a$10$E6..."
 *
 *     News:
 *       type: object
 *       required:
 *         - title
 *         - text
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7f..."
 *         title:
 *           type: string
 *           example: "Заголовок новости"
 *         text:
 *           type: string
 *           example: "Текст новости"
 *         imageURL:
 *           type: string
 *           example: "/uploads/image123.jpg"
 *         fileURL:
 *           type: string
 *           example: "/uploads/file123.pdf"
 *         author:
 *           $ref: '#/components/schemas/User'
 *         isPublished:
 *           type: boolean
 *           example: false
 *         publishDate:
 *           type: string
 *           format: date-time
 *           example: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-29T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-30T12:00:00Z"
 */

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  imageURL: {
    type: String,
  },
  fileURL: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);
const News = mongoose.model('News', newsSchema);

module.exports = {
  User,
  News,
};
