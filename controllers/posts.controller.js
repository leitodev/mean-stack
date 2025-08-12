const Post = require("../models/post");

exports.createPost = async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userTokenData.userId
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
}
exports.getPosts = async (req, res, next) => {

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
        posts: posts.map(({ id, title, content, imagePath, creator }) => ({ id, title, content, imagePath, creator })),
        totalPosts
    });
}
exports.updatePost = async (req, res) => {

    if (req.body.title === '') {
        res.status(400).json({
            message: 'title should not be empty!',
        });
        return;
    }

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

    const updatedPost = await Post.updateOne({ _id: req.params.id, creator: req.userTokenData.userId }, post);

    if (updatedPost.modifiedCount > 0) {
        res.status(200).json({
            message: 'updated post successfully!',
            data: {...updatedPost, postName: req.body.title}
        });
        return;
    }

    res.status(401).json({
        message: 'incorrect user!'
    });

}
exports.deletePost = async (req, res) => {

    const deletedPost = await Post.deleteOne({ _id: req.params.id, creator: req.userTokenData.userId });

    if (deletedPost.deletedCount > 0) {
        const totalPosts = await Post.countDocuments();
        res.status(200).json({
            message: req.params.id + ' successfully deleted.',
            totalPosts
        });
        return;
    }

    res.status(401).json({
        message: 'You can\'t delete!!!'
    });

}