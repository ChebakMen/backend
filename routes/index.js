const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, NewsController } = require('../controllers');

const authenticateToken = require('../middleware/auth');

// //Храним файлы в
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + file.originalname);
  },
});

const upload = multer({ storage });

//User
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);

//News
router.post(
  '/news',
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  NewsController.create,
);
router.put('/news/:id', authenticateToken, NewsController.update);
router.delete('/news/:id', authenticateToken, NewsController.delete);
router.get('/news', authenticateToken, NewsController.getAllNews);
router.put('/news/published/:id', authenticateToken, NewsController.published);
router.get('/news/published/', authenticateToken, NewsController.getAllPublished);
router.get('/news/:id', authenticateToken, NewsController.getNewsById);

module.exports = router;
