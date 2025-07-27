
const express = require('express');
const Post = require("../models/post");
const multer = require("multer");
const router = express.Router();
const storage = require("../multer_config");
const checkAuth = require("../middleware/check-auth");

// parent path is '/api/posts'
router.post('', checkAuth, multer({storage: storage}).single('image'),async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    console.log('req.protocol', req.protocol);

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
    });

    const createdPost = await newPost.save(); // INSERT
    const totalPosts = await Post.countDocuments();

    try {
        res.status(200).json({
            message: 'success',
            data: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            },
            totalPosts
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

    const currentPage = +req.query.page;
    const pageSize = +req.query.pagesize;
    const postQuery = Post.find({});

    if (currentPage && pageSize) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    const posts = await postQuery; // Fetch all posts /// SELECT *
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts.map(({ id, title, content, imagePath }) => ({ id, title, content, imagePath })),
        totalPosts
    });
});

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), async (req, res) => {
    // TODO delete old versions of images
    let imagePath = '';

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/images/" + req.file.filename;
    } else {
        imagePath = req.body.imagePath
    }

    // UPDATE (!important to set _id)
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    const updatedPost = await Post.updateOne({ _id: req.params.id }, post);

    res.status(200).json({
        message: 'updated post successfully!',
        data: updatedPost
    });

});

router.delete('/:id', checkAuth, async (req, res) => {

    const deletedPost = await Post.deleteOne({ _id: req.params.id });
    console.log('deletedPost', deletedPost);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
        message: req.params.id + ' successfully deleted.',
        totalPosts
    });

})

module.exports = router