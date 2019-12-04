const express = require('express');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const MongoClient = require('mongodb').MongoClient;

const Responce = require('./modules/Responce');

const PORT = process.env.PORT || 3000;




// Connection to the database
console.log('Сonnecting to the database...');
MongoClient.connect('mongodb+srv://admin:Bi92ly94@cluster0-dnfdv.mongodb.net/infospace', {useUnifiedTopology: true}, function (err, client) {
    // Error handling
    if (err) throw err
    // Success
    console.log('Connected!');

    var db = client.db('infospace');
    
    // Running the server
    console.log('Running the server...');
    express()
    .use(bodyParser.urlencoded({ extended: false }))
    // login
    .post('/log/', (req, res) => {
        // Error handling
        if (!req.body) {
            res.status(400).send(new Responce(400, false, {message: 'body must exist'}).toString());
            return;
        }

        let name = req.body.name;
        let pass = req.body.pass;

        if (!name || !name.match(/^[0-9a-zA-Z]{8,16}$/) || !name.match(/[a-zA-Z]/)) {
            res.status(400).send(new Responce(400, false, {message: 'name must have from 8 to 16 ANCII and at least 1 latin character'}).toString());
            return;
        }
        if (!pass || !pass.match(/^[0-9a-zA-Z]{8,16}$/) || !pass.match(/[a-zA-Z]/)) {
            res.status(400).send(new Responce(400, false, {message: 'password must from 8 to 16 ANCII and at least 1 latin character'}).toString());
            return;
        }

        // Success
        name = sha256(name);
        pass = sha256(pass);

        db.collection('hashed').find({_id: name}).toArray(function(err, result) {
            if (err) {
                res.status(404).send(new Responce(404, false, {message: 'user with such login not found'}).toString());
                return;
            }
            if (pass !== result[0].hash) {
                res.status(400).send(new Responce(400, false, {message: 'wrong password'}).toString());
                return;
            }

            let jsonInfo = {
                message: 'welcome',  
                name: req.body.name, 
                date: result[0].date
            };
            if (result[0].isAdmin) {
                jsonInfo.isAdmin = result[0].isAdmin;
            }
            res.status(200).send(new Responce(200, true, jsonInfo).toString());
        });
    })
    // registarion
    .post('/reg/', (req, res) => {
        // Error handling
        if (!req.body) {
            res.status(400).send(new Responce(400, false, {message: 'body must exist'}).toString());
            return;
        }

        const name = req.body.name;
        const pass = req.body.pass;

        if (!name || !name.match(/^[0-9a-zA-Z]{8,16}$/) || !name.match(/[a-zA-Z]/)) {
            res.status(400).send(new Responce(400, false, {message: 'name must have from 8 to 16 ANCII and at least 1 latin character'}).toString());
            return;
        }
        if (!pass || !pass.match(/^[0-9a-zA-Z]{8,16}$/) || !pass.match(/[a-zA-Z]/)) {
            res.status(400).send(new Responce(400, false, {message: 'password must from 8 to 16 ANCII and at least 1 latin character'}).toString());
            return;
        }

        // Success
        let record = {_id: sha256(name), hash: sha256(pass), date: new Date()};
        if (req.body.isAdmin) 
            record.isAdmin = true;

        db.collection('hashed').insertOne(record, function(err){
            if (err) {
                res.status(400).send(new Responce(400, false, {message: 'user with such login is allready exist'}).toString());
                return;
            };
            res.status(200).send(new Responce(200, true, {message: 'done'}).toString());
        })
        
        

    })
    .listen(PORT, () => {console.log(`Listening on port ${PORT}`)})
})



