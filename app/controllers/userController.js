const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.signup = (req, res) => {
    if (!req.body.password || !req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/))
        return res.status(400).json({ok: false, message: 'Password must contains minimum 8 characters, maximum 16, at least one uppercase letter, one lowercase letter and one number'});
        
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length > 0) return res.status(409).json({ok: false, message: 'User with provided email is already exists'});

        Admin.findById(req.body.adminId)
        .exec()
        .then(admin => {
            // 5e05044f733eab62682a307f - default admin id
            const adminId = !admin ? "5e05044f733eab62682a307f" : req.body.adminId;

            const newuser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: crypto.pbkdf2Sync(req.body.password, 'salt', 10, 64, 'sha512'),
                adminId: adminId
            })
        
            newuser
            .save()
            .then(result => {
                res.status(201).json({ok: true, message: 'New user successfully added', data: {
                    id: result._id,
                    email: result.email,
                    adminId: adminId
                }})
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
        
        
    })
}
exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        if (!user) 
            return res.status(401).json({ok: false, message: 'Authorization failed'});

        if (user.password != crypto.pbkdf2Sync(req.body.password, 'salt', 10, 64, 'sha512')) 
            return res.status(401).json({ok: false, message: 'Authorization failed'});

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id
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
        res.status(500).json({ok: false, error: err});
    })
}
exports.get_by_id = (req, res) => {
    const id = req.params.id;

    if (id !== req.userData.userId) return res.status(401).json({ok: false, message: 'You do not have access to do this'});

    User.findById(id)
    .select('email adminId')
    .exec()
    .then((user) => {
        if (!user) return res.status(404).json({ ok: false, message: 'No user found for provided id'});
        
        res.status(200).json({ok: true, data: user});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.get_by_adminId = (req, res) => {
    const id = req.params.id;

    if (id !== req.userData.adminId) return res.status(401).json({ok: false, message: 'You do not have access to do this'});

    User.find({ adminId: id})
    .select('_id email adminId')
    .exec()
    .then((users) => {
        if (users.length < 0) return res.status(404).json({ ok: false, message: 'No users found for provided id'});
        
        res.status(200).json({ok: true, count: users.length, data: users});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}