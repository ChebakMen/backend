const { News } = require('../models/schema');
const path = require('path');
const newsController = {
  create: async (req, res) => {
    const { title, text } = req.body;
    const image = req.file;
    const authorId = req.user.userId;

    if (!title || !text) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const imageURL = '';
      if (image) {
        imageURL = `/uploads/${image.filename}`;
      }

      const news = await News.create({
        title: title,
        author: authorId,
        text: text,
        imageURL: imageURL,
      });

      res.json(news);
    } catch (error) {
      console.error('Error in newsCreate', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    let filePath;
    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    try {
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
    console.log('1', news);
    console.log('2', news.author.authorId);
    console.log('3', req.user.userId);

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
