const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: String,
    password: String,
    date: Date,
    isAdmin: Boolean
});

module.exports = mongoose.model('User', userSchema);