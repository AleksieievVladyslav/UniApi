const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    description: String,
    info: { type: String, require: true }
});

module.exports = mongoose.model('Type', typeSchema);