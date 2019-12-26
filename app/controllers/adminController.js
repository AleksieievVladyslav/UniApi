const Admin = require('../models/adminSchema');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    Admin.find({email: req.body.email})
    .exec()
    .then(admin => {
        if (admin.length > 0) return res.status(409).json({ok: false, message: 'Admin with provided mail is already exists'});

        const newadmin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: crypto.pbkdf2Sync(req.body.password, 'salt', 10, 64, 'sha512'),
            groupname: req.body.groupname,
            description: req.body.description
        })
    
        newadmin
        .save()
        .then(result => {
            res.status(201).json({ok: true, message: 'New admin successfully added', data: {
                id: result._id,
                email: result.email,
                groupname: result.groupname,
                description: result.description
            }})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ok: false, message: 'unknown error occurs'});
        })
    })

    
}
exports.signin = (req, res) => {
    Admin.findOne({ email: req.body.email })
    .exec()
    .then(admin => {
        if (!admin) 
            return res.status(401).json({ok: false, message: 'Authorization failed'});

        if (admin.password != crypto.pbkdf2Sync(req.body.password, 'salt', 10, 64, 'sha512')) 
            return res.status(401).json({ok: false, message: 'Authorization failed'});

        const token = jwt.sign(
            {
                email: admin.email,
                adminId: admin._id
            }, 
            process.env.JWT_KEY, 
            {
                expiresIn: '1h'
            }
        );
        res.status(200).json({ok: true, message: 'Authorization succeed', token: token})

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, message: 'unknown error occurs'});
    })
}
exports.delete = (req, res) => {
    Admin.remove({ _id: req.params.id })
    .exec()
    .then(result => {
        res.status(200).json({
            ok: true,
            message: 'The admin successfully deleted',
            data: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, message: 'unknown error occurs'});
    })
}