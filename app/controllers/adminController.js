const Admin = require('../models/adminSchema');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.get_by_id = (req, res) => {
    const id = req.params.id;

    if (id !== req.userData.adminId) return res.status(401).json({ok: false, message: 'You do not have access to do this'});

    Admin.findById(id)
    .select('email groupname description')
    .exec()
    .then((admin) => {
        if (!admin) return res.status(404).json({ ok: false, message: 'No admins found for provided id'});
        
        res.status(200).json({ok: true, data: admin});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.signup = (req, res) => {
    if (!req.body.password || !req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/))
        return res.status(400).json({ok: false, message: 'Minimum 8 characters, maximum 16, at least one uppercase letter, one lowercase letter and one number'});
        
    Admin.find({email: req.body.email})
    .exec()
    .then(admin => {
        if (admin.length > 0) return res.status(409).json({ok: false, message: 'Admin with provided email is already exists'});

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
            res.status(500).json({ok: false, error: err});
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
        res.status(500).json({ok: false, error: err});
    })
}
exports.patch = (req, res) => {
    const id = req.params.id;

    if (id !== req.userData.adminId) return res.status(401).json({ok: false, message: 'You do not have access to do this'});

    const updateOps = {};
    for (const ops of req.body) {
        if (ops.propName == '_id' || ops.propName == 'email') continue;
        if (ops.propName == 'password') {
            updateOps[ops.propName] = crypto.pbkdf2Sync(ops.value, 'salt', 10, 64, 'sha512');
            continue;
        }
        updateOps[ops.propName] = ops.value;
    }
    
    Admin.updateOne({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({ok: true, message: 'The admin successfully updated', data: result})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ok: false, error: err});
    })
}
exports.delete = (req, res) => {
    if (req.params.id !== req.userData.adminId) return res.status(401).json({ok: false, message: 'You do not have access to do this'});

    Admin.deleteOne({ _id: req.params.id })
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
        res.status(500).json({ok: false, error: err});
    })
}