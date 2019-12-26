const Device = require('../models/deviceSchema');
const Type = require('../models/typeSchema');
const mongoose = require('mongoose');

exports.get_by_id = (req, res) => {
    const id = req.params.id;

    Device.findById(id)
    .select('_id temperature pressure typeId')
    .exec()
    .then((device) => {
        if (!device) return res.status(404).json({ ok: false, message: 'No devices found for provided id'});
        
        res.status(200).json({ok: true, data: device});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.get_by_typeId = (req, res) => {
    const typeId = req.params.id;

    Device.find({ typeId: typeId})
    .select('_id temperature pressure typeId')
    .exec()
    .then((devices) => {
        if (!devices) return res.status(404).json({ ok: false, message: 'No devices found for provided type id'});
        
        res.status(200).json({ok: true, conunt: devices.length, data: devices});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.post = (req, res) => {
    const typeId = req.body.typeId;
    Type.findById(typeId)
    .exec()
    .then(type => {
        if (!type) return res.status(500).json({ok: false, message: 'No such type found for provided type id'})

        const temperature = req.body.temperature;
        const pressure = req.body.pressure;
        const device = new Device({
            _id: new mongoose.Types.ObjectId(),
            typeId: typeId,
            temperature: temperature,
            pressure: pressure
        })
        
        device.save()
        .then(result => {
            res.status(201).json({ok: true, message: 'New device successfully added', data: {
                id: result._id,
                temperature: result.temperature,
                pressure: result.pressure,
                typeId: result.typeId
            }});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ok: false, error: err});
        })
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
    
    Device.updateOne({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({ok: true, message: 'The device successfully updated', data: result})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    
    Device.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({ok: true, message: 'The device successfully deleted', data: result})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}