const Type = require('../models/typeSchema');
const mongoose = require('mongoose');

exports.get_by_id = (req, res) => {
    const id = req.params.id;

    Type.findById(id)
    .select('name _id info desc')
    .exec()
    .then((type) => {
        if (!type) return res.status(404).json({ ok: false, message: 'No types found for provided id'});
        
        res.status(200).json({ok: true, data: type});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.post = (req, res) => {
    const info = req.body.info;
    const name = req.body.name;
    const description = req.body.description;

    const type = new Type({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        info: info,
        description: description
    })

    type.save()
    .then(result => {
        res.status(201).json({ok: true, message: 'New type successfully added', data: {
            id: result._id,
            name: result.name,
            info: result.info,
            description: result.description
        }});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.patch = (req, res) => {
    const id = req.params.id;

    const updateOps = {};
    for (const ops of req.body) {
        if (ops.propName == '_id') continue;
        updateOps[ops.propName] = ops.value;
    }
    
    Type.updateOne({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({ok: true, message: 'The type successfully updated', data: result})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    
    Type.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({ok: true, message: 'The type successfully deleted', data: result})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}