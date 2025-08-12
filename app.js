const express = require('express');
const path = require('path');
require('dotenv').config();

const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

const app = express();

const mongoURI = process.env.MONGODB_URI;
const FRONT_END_CORS_URL = process.env.FRONT_END_CORS_URL;

mongoose.connect(mongoURI, {
    dbName: 'mean-db'
})
.then(() => {
    console.log('Connected to https://cloud.mongodb.com/');
}).catch(() => {
    console.log('Failed to connect to https://cloud.mongodb.com/');
})

// Middleware to parse JSON body
app.use(express.json());
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// allow static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', FRONT_END_CORS_URL);
    // res.setHeader('Access-Control-Allow-Origin', '*'); // for all
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    next();
});

// used path '/api/posts' for all child routes 'postsRoutes'
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;


