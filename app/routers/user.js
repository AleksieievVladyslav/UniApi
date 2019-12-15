const express = require('express');
const router = express.Router();
const sha256 = require('sha256');

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

    res.status(200).json({ok: true});
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
    let record = {_id: sha256(name), hash: sha256(pass), date: new Date()};
    if (req.body.isAdmin) record.isAdmin = true;

    res.status(200).json({ok: true, message: 'done'});
})

module.exports = router;