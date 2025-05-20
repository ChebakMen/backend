const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, NewsController } = require('./controllers');

const authenticateToken = require('../middleware/auth');

const destination = 'uploads';

//Храним файлы в
const storage = multer.diskStorage({
  destination: destination,
  filename: function (req, file, collback) {
    collback(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

//User
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);

//News
router.post('/news', authenticateToken, NewsController.create);
router.put('/news/:id', authenticateToken, NewsController.update);
router.delete('/news/:id', authenticateToken, NewsController.delete);
router.get('/news', authenticateToken, NewsController.getAllNews);
router.put('/news/published/:id', authenticateToken, NewsController.published);
router.get('/news/published/', authenticateToken, NewsController.getAllPublished);

module.exports = router;
