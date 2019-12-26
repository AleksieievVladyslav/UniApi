const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
    temperature: { type: Number, default: 0 },
    pressure: { type: Number, default: 0 }
});

module.exports = mongoose.model('Device', deviceSchema);