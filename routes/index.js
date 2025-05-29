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

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Зарегистрировать пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: oleg@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: oleg228
 *               name:
 *                 type: string
 *                 example: oleg
 *
 *     responses:
 *       200:
 *         description: Успешная регистрация пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: oleg@gmail.ru
 *                 name:
 *                   type: string
 *                   example: oleg
 *                 password:
 *                   type: string
 *                   example: hashed_password
 *                 id:
 *                   type: string
 *                   example: 6381sad31283...
 *                 __v:
 *                    type: string
 *                    example: 0
 *       400:
 *         description: Такой пользователь уже существует или не заполнены обязательные поля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Такой пользователь уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *     security: []  # регистрация обычно не требует токена
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Войти в систему (получить JWT токен)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает JWT токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Неверный логин или пароль или отсутствуют поля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Неверный логин или пароль
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *     security: []
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /current:
 *   get:
 *     tags:
 *       - User
 *     summary: Получить текущего пользователя по JWT токену
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные текущего пользователя
 *         content:
 *            application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                    email:
 *                      type: string
 *                      example: oleg@gmail.ru
 *                    name:
 *                      type: string
 *                      example: oleg
 *                    password:
 *                      type: string
 *                      example: hashed_password
 *                    id:
 *                      type: string
 *                      example: 6381sad31283...
 *                    __v:
 *                        type: string
 *                        example: 0
 *       400:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Не удалось найти пользователя
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/current', authenticateToken, UserController.current);

//News
/**
 * @swagger
 * /news:
 *    post:
 *       tags:
 *        - News
 *       summary: Создать новость
 *       security:
 *        - bearerAuth: []
 *       requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                type: object
 *                required:
 *                  - title
 *                  - text
 *                properties:
 *                  title:
 *                    type: string
 *                    example: "Заголовок новости"
 *                  text:
 *                    type: string
 *                    example: "Текст новости"
 *                  image:
 *                    type: string
 *                    format: binary
 *                  file:
 *                    type: string
 *                    format: binary
 *       responses:
 *         200:
 *           description: Созданная новость
 *           content:
 *             application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/News'
 *                  - type: object
 *                    properties:
 *                      updatedAt:
 *                        type: string
 *                        example: ""
 *         400:
 *           description: Не заполнены обязательные поля
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Не заполнены обязательные поля
 *         401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Unauthorized
 *         500:
 *            description: Ошибка сервера
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: string
 *                      example: Internal server error
 */
router.post(
  '/news',
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  NewsController.create,
);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     tags:
 *       - News
 *     summary: Редактировать новость
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                type: object
 *                required:
 *                  - title
 *                  - text
 *                properties:
 *                  title:
 *                    type: string
 *                    example: "Заголовок новости"
 *                  text:
 *                    type: string
 *                    example: "Текст новости"
 *                  image:
 *                    type: string
 *                    format: binary
 *                    content:
 *                      image/*: {}
 *                  file:
 *                    type: string
 *                    format: binary
 *     responses:
 *       200:
 *         description: Новость успешно отредактирована
 *         content:
 *           application/json:
 *             schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/News'
 *                  - type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        example: "Обновленный зоголовок"
 *                      updatedAt:
 *                        type: string
 *                        example: "Сейчас"

 *                      text:
 *                        type: string
 *                        example: "Обновленный текст"
 *                      imageURL:
 *                        type: string
 *                        example: "Новая картинка"
 *                      fileURL:
 *                        type: string
 *                        example: "Новый файл"
 *       400:
 *         description: Нет доступа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Нет доступа
 *       404:
 *         description: Новость не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.put(
  '/news/:id',
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  NewsController.update,
);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     tags:
 *       - News
 *     summary: Удалить новость по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Новость успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 massage:
 *                   type: string
 *                   example: Новость успешно удалена
 *       400:
 *         description: Нет доступа
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Нет доступа
 *       404:
 *         description: Новость не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *
 */
router.delete('/news/:id', authenticateToken, NewsController.delete);

/**
 * @swagger
 * /news:
 *   get:
 *     tags:
 *       - News
 *     summary: Получить все новости
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Списаок всех новостей

 *       404:
 *         description: Нет созданных новостей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Нет созданных новостей
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/news', authenticateToken, NewsController.getAllNews);

/**
 * @swagger
 * /news/published/{id}:
 *   put:
 *     tags:
 *       - News
 *     summary: Опубликовать/запланировать новость
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Новость успешно опубликованна
 *         content:
 *           application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/News'
 *                  - type: object
 *                    properties:
 *                      isPublished:
 *                        type: string
 *                        example: "true"
 *                      publishDate:
 *                        type: string
 *                        example: "2025-05-29T10:00:00Z"
 *
 *       400:
 *         description: Новость уже опубликованна
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость уже опубликованна
 *       404:
 *         description: Новость не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/news/published/:id', authenticateToken, NewsController.published);

/**
 * @swagger
 * /news/published:
 *   get:
 *     tags:
 *       - News
 *     summary: Получить все опубликованные новости
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Список всех новостей

 *       400:
 *         description: Новость уже опубликованна
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость уже опубликованна
 *       404:
 *         description: Новость не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/news/published/', authenticateToken, NewsController.getAllPublished);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     tags:
 *       - News
 *     summary: Получить новость по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успешный ответ с новостью
 *         content:
 *           application/json:
 *              schema:
 *                 $ref: '#/components/schemas/News'
 *
 *       404:
 *         description: Новость не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Новость не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *
 */
router.get('/news/:id', authenticateToken, NewsController.getNewsById);

module.exports = router;
