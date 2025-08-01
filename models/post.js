const mongoose = require('mongoose');

// Blueprint
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

// Post - запись
// posts - table
module.exports = mongoose.model('Post', postSchema);