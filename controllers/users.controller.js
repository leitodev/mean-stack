const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

exports.createUser = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUser = await mongoose.models.User.findOne({ email: req.body.email });

    if (existingUser) {
        res.status(401).json({
            message: 'this email already exist!',
        });
        return;
    }

    const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
    });

    const createdUser = await newUser.save(); // INSERT

    res.status(200).json({
        message: 'success',
        data: {
            id: createdUser._id
        },
    });

}

exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(401).json({
            message: 'User don\'t exist!',
        });
        return;
    }

    // check password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        res.status(401).json({
            message: 'Auth error',
        });
        return;
    }

    const token = jwt.sign({email: user.email, userId: user._id},
        JWT_PRIVATE_KEY, // TODO need to put it into ENV file
        {expiresIn: '1h'});

    res.status(200).json({
        userData: {id: user._id, name: user.email},
        isPasswordValid: isPasswordValid,
        token: token,
        expiresIn: 3600
    });

}