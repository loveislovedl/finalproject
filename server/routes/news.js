// news.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { translateText } = require('./news');
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

const adminLayout = '../views/layouts/admin';

router.get("/news", async (req, res) => {
  const car = req.query.car;
  const targetLanguage = req.query.targetLanguage || 'en'; // Default to English
  const newsApiKey = "24b8e41ecc3e4618a1a77387786243d3";

  let newsData;
  let error = null;

  try {
    const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(car)}&apiKey=${newsApiKey}`);
    newsData = newsResponse.data;

    // Translate news articles if a target language is specified
    if (targetLanguage !== 'en') {
      const translatedArticles = await Promise.all(newsData.articles.map(async article => {
        const translatedTitle = await translateText(article.title, targetLanguage);
        const translatedDescription = await translateText(article.description, targetLanguage);
        return {
          ...article,
          title: translatedTitle,
          description: translatedDescription
        };
      }));
      newsData.articles = translatedArticles;
    }

    const locals = {
      title: 'News',
      description: 'Portfolio platform',
    }

    res.render('admin/news', {
      locals,
      newsData,
      layout: adminLayout
    });
  } catch (error) {
    newsData = null;
    error = error.message || "Error, please try again";
  }
});

module.exports = router;
