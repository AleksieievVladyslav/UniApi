const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    info: { type: String, require: true },
    description: String,
});

module.exports = mongoose.model('Type', typeSchema);