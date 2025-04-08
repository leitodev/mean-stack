
const express = require('express');
const Post = require("../models/post");

const router = express.Router();

// parent path is '/api/posts'
router.post('', async (req, res) => {

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    const createdPost = await newPost.save(); // INSERT

    try {
        res.status(200).json({
            message: 'success',
            data: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content
            }
        });
    } catch (err) {
        res.status(400).json({
            message: 'invalid data format',
            data: err._message
        });
        console.log('error:', err._message);
    }

});

router.get('', async (req, res, next) => {
    const posts = await Post.find({}); // Fetch all posts /// SELECT *

    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts.map(({ id, title, content }) => ({ id, title, content }))
    });
});

router.put('/:id', async (req, res) => {
    // UPDATE (!important to set _id)
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });

    const updatedPost = await Post.updateOne({ _id: req.params.id }, post);

    res.status(200).json({
        message: 'updated post successfully!',
        data: updatedPost
    });

});

router.delete('/:id', async (req, res) => {

    const deletedPost = await Post.deleteOne({ _id: req.params.id });
    console.log('deletedPost', deletedPost);

    res.status(200).json({
        message: req.params.id + ' successfully deleted.',
    });

})

module.exports = router