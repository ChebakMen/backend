const { User } = require('../models/schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: 'Такой пользователь уже существует' });
      }

      const hashedPasword = await bcrypt.hash(password, 8);

      const user = await User.create({
        email: email,
        password: hashedPasword,
        name: name,
      });

      res.json(user);
    } catch (error) {
      console.error('Error in register', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      res.send(token);
    } catch (error) {
      console.error('Error in login', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  //на основе токена находим user
  current: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.userId });

      if (!user) {
        return res.status(400).json({ error: 'Не удолось найти пользователя' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in currentUser', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = UserController;
