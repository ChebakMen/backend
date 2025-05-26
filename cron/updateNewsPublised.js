const cron = require('node-cron');
const { News } = require('../models/schema');

function updateNewsPublished() {
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        const nowTime = new Date();

        const noUpdateNews = await News.find({
          isPublished: false,
        });

        const newsToPublish = noUpdateNews.filter(
          (news) => news.publishDate && news.publishDate <= nowTime,
        );

        let count = 0;
        for (let news of newsToPublish) {
          count++;
          news.isPublished = true;
          await news.save();
        }
        if (count != 0) {
          console.log(`Опубликовано новостей: ${newsToPublish.length}`);
        }
      } catch (error) {
        console.error('Ошибка при обновлении статуса публикации:', error);
      }
    },
    {
      timezone: 'Asia/Krasnoyarsk',
    },
  );
}

module.exports = updateNewsPublished;
