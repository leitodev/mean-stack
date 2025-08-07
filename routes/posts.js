
const express = require('express');
const multer = require("multer");
const router = express.Router();
const storage = require("../multer_config"); // img storing
const checkAuth = require("../middleware/check-auth");

const postController = require("../controllers/posts.controller");

// parent path is '/api/posts'
router.post('', checkAuth, multer({storage: storage}).single('image'), postController.createPost);
router.get('', postController.getPosts);
router.put('/:id', checkAuth, multer({storage: storage}).single('image'), postController.updatePost);
router.delete('/:id', checkAuth, postController.deletePost)

module.exports = router