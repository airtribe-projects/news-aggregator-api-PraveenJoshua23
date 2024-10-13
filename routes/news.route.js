require('dotenv').config();
const express = require('express');
const axios = require('axios');
const User = require('../models/user.model');
const verifyToken = require('../middlewares/verify-token');
const NodeCache = require('node-cache');
const newsCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const router = express.Router();


router.get('/news', verifyToken, async (req, res) => {
    try {
        const email =  req.user.email ;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          const cacheKey = req.user.id;
          const cachedNews = newsCache.get(cacheKey);
        
        if (cachedNews) {
            return res.json(cachedNews);
        }

        const preferences = user.preferences; 
 
        if(!preferences) {
            return res.status(400).json({ message: 'User preferences not found' });
        }

        // const { category, language, country } = userPreferences;
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                category: preferences.category,
                language: preferences.language,
                country: preferences.country,
                apiKey: process.env.NEWSAPI_KEY
            }
        });
        newsCache.set(cacheKey, response.data.articles);
        res.json(response.data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
});

router.post('/news/:id/read', verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const articleId = req.params.id;
        if (!user.readArticles.includes(articleId)) {
            user.readArticles.push(articleId);
            await user.save();
        }

        res.status(200).json({ message: 'Article marked as read' });
    } catch (error) {
        console.error('Error marking article as read:', error);
        res.status(500).json({ error: 'Failed to mark article as read' });
    }
});

router.post('/news/:id/favorite', verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const articleId = req.params.id;
        if (!user.favoriteArticles.includes(articleId)) {
            user.favoriteArticles.push(articleId);
            await user.save();
        }

        res.status(200).json({ message: 'Article marked as favorite' });
    } catch (error) {
        console.error('Error marking article as favorite:', error);
        res.status(500).json({ error: 'Failed to mark article as favorite' });
    }
});

router.get('/news/read', verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.readArticles);
    } catch (error) {
        console.error('Error retrieving read articles:', error);
        res.status(500).json({ error: 'Failed to retrieve read articles' });
    }
});

router.get('/news/favorites', verifyToken, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.favoriteArticles);
    } catch (error) {
        console.error('Error retrieving favorite articles:', error);
        res.status(500).json({ error: 'Failed to retrieve favorite articles' });
    }
});

router.get('/news/search/:keyword', verifyToken, async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: keyword,
                apiKey: process.env.NEWSAPI_KEY
            }
        });

        res.json(response.data.articles);
    } catch (error) {
        console.error('Error searching for news:', error);
        res.status(500).json({ error: 'Failed to search for news articles' });
    }
});



module.exports = router;