const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users.controller');

// parent path is '/users/signup'
router.post('/signup', UserController.createUser);
router.post('/login',UserController.login);

module.exports = router