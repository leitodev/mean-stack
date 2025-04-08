const mongoose = require('mongoose');

// Blueprint
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

// Post - запись
// posts - table
module.exports = mongoose.model('Post', postSchema);