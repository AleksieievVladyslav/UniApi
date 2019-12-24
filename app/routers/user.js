const express = require('express');
const router = express.Router();
const sha256 = require('sha256');
const User = require('../models/userSchema');


router.get('/', (req, res, next) => {
    // handling errors
    if (!req.body) 
        return res.status(400).json({ok: false, message: 'body must exist'});

    let name = req.query.name;
    let pass = req.query.pass;

    // validating fields
    if (!name || !name.match(/^[0-9a-zA-Z]{8,16}$/) || !name.match(/[a-zA-Z]/)) 
        return res.status(400).json({ok: false, message: 'name must have from 8 to 16 and at least 1 latin character'});
    if (!pass || !pass.match(/^[0-9a-zA-Z]{8,16}$/) || !pass.match(/[a-zA-Z]/))
        return res.status(400).send({ok: false, message: 'password must have from 8 to 16 and at least 1 latin character'});

    // success
    name = sha256(name);
    pass = sha256(pass);

    User.findById(name)
        .then((user) => {
            if (user) {
                if (user.password == pass) {
                    res.status(200).json({ok: true, data: {date: user.date, isAdmin: user.isAdmin}});
                } else {
                    res.status(400).json({ok: false, message: "Incorrect password"});
                }
            }
            else {
                res.status(404).json({ok: false, message: 'user with such name is not found'});
            }
        })
        .catch((err) => {
            return res.status(500).json({ok: false, message: "unknown error occurs"});
        })
})
router.post('/', (req, res, next) => {
    // handling errors
    if (!req.body) 
        return res.status(400).json({ok: false, message: 'body must exist'});

    const name = req.body.name;
    const pass = req.body.pass;

    // validating fields
    if (!name || !name.match(/^[0-9a-zA-Z]{8,16}$/) || !name.match(/[a-zA-Z]/)) 
        return res.status(400).json({ok: false, message: 'name must have from 8 to 16 and at least 1 latin character'});
    if (!pass || !pass.match(/^[0-9a-zA-Z]{8,16}$/) || !pass.match(/[a-zA-Z]/))
        return res.status(400).json({ok: false, message: 'password must have from 8 to 16 and at least 1 latin character'});

    // success
    const user = new User({
        _id: sha256(name),
        password: sha256(pass),
        date: new Date(),
        isAdmin: req.body.isAdmin
    });
    user
    .save()
    .then((result) => {
        console.log(result);
        res.status(201).json({ok: true, message: 'done'});
    })
    .catch((err) => {
        if (err.code === 11000)
            return res.status(400).json({ok: false, message: "user with such login is allready exits"});
        else 
            return res.status(500).json({ok: false, message: "unknown error occurs"});
    });

})
router.delete('/', (req, res, next) => {
    // handling errors
    if (!req.body) 
        return res.status(400).json({ok: false, message: 'body must exist'});

    let name = req.body.name;

    // validating fields
    if (!name || !name.match(/^[0-9a-zA-Z]{8,16}$/) || !name.match(/[a-zA-Z]/)) 
        return res.status(400).json({ok: false, message: 'name must have from 8 to 16 and at least 1 latin character'});

    name = sha256(name);

    User.remove({_id: name})
    .then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ok: true, message: 'Successfuly deleted'});
        }
        else {
            res.status(304).json({ok: false, message: 'Not deleted'});
        }
    })
    .catch(err => {
        res.status(500).json({ok: false, message: 'unknown error occurs'});
    })
})

module.exports = router;