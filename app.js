require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
    
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

app.use('/api', require('./routes/user.route'));
app.use('/api', require('./routes/news.route'));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;