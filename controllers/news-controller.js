const { default: mongoose } = require('mongoose');
const { News } = require('../models/schema');
const newsController = {
  create: async (req, res) => {
    const { title, text } = req.body;

    const authorId = req.user.userId;

    if (!title || !text) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const image = req.files['image'] ? req.files['image'][0] : null;
      const file = req.files['file'] ? req.files['file'][0] : null;

      let imageURL = '';
      if (image) {
        imageURL = `/uploads/${image.filename}`;
      }
      let fileURL = '';
      if (file) {
        fileURL = `/uploads/${file.filename}`;
      }

      const news = await News.create({
        title: title,
        author: authorId,
        text: text,
        imageURL: imageURL,
        fileURL: fileURL,
      });

      res.json(news);
    } catch (error) {
      console.error('Error in newsCreate', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const { title, text } = req.body;

    try {
      const image = req.files['image'] ? req.files['image'][0] : null;
      const file = req.files['file'] ? req.files['file'][0] : null;

      const news = await News.findOne({ _id: id });

      //В задании не указанно можно ли редактировать новость, когда она опубликованна
      //Тоесть если новость опубликованна и ее уже нельзя менять, тогда нужно раскоментить код
      // if (news.isPublished === true) {
      //   return res.status(400).json({ error: 'Новость уже опубликованна' });
      // }

      if (news.author._id != req.user.userId) {
        return res.status(400).json({ error: 'Нет доступа' });
      }

      news.title = title;
      news.text = text;

      let imageURL = news.imageURL;
      if (image) {
        imageURL = `/uploads/${image.filename}`;
      }
      let fileURL = news.fileURL;
      if (file) {
        fileURL = `/uploads/${file.filename}`;
      }

      news.imageURL = imageURL;
      news.fileURL = fileURL;

      news.save();
      res.json(news);
    } catch (error) {
      console.error('Error in updateNews', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  published: async (req, res) => {
    const id = req.params.id;
    const { date } = req.body;
    try {
      const news = await News.findOne({ _id: id });

      if (!news) {
        return res.status(404).json({ error: 'Новость не найдена' });
      }
      if (news.isPublished == true) {
        return res.status(400).json({ error: 'Новость уже опубликована' });
      }

      if (date) {
        news.publishDate = new Date(date);
        news.isPublished = false;
      } else {
        news.publishDate = new Date();
        news.isPublished = true;
      }

      await news.save();

      res.json(news);
    } catch (error) {
      console.error('Error in publisedNews', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getAllPublished: async (req, res) => {
    try {
      const news = await News.find({ isPublished: true })
        .populate('author')
        .sort({ createdAt: -1 })
        .exec();

      return res.json(news);
    } catch (error) {
      console.error('Error in getAllPublished', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getNewsById: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Неправильный ID' });
      }
      const news = await News.findOne({ _id: id }).populate('author');

      if (!news) {
        return res.status(404).json({ error: 'Новость не найдена' });
      }

      return res.json(news);
    } catch (error) {
      console.error('Error in getNewsById', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    const news = await News.findOne({ _id: id }).populate('author');
    if (!news) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }

    if (news.author._id != req.user.userId) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    try {
      await News.deleteOne({ _id: id });

      res.json({ massage: 'Новость уcпешно удалена' });
    } catch (error) {
      console.error('Error in deleteNews', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getAllNews: async (req, res) => {
    try {
      const news = await News.find().populate('author').sort({ createdAt: -1 }).exec();
      return res.json(news);
    } catch (error) {
      console.error('Error in getAllNews', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = newsController;
