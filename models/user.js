const mongoose = require('mongoose');

// Blueprint
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, //  unique: true - it's only for mongoDB performance !!!it isn't validator!!!
    password: { type: String, required: true },
})

// User - запись
// users - table
module.exports = mongoose.model('User', userSchema);