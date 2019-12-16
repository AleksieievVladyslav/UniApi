const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./app/routers/user');
const morgan = require('morgan');

const app = express()
.use(morgan('dev'))
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())

.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

.use('/user', userRouter)

//Handling error
.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
.use((error, req, res, next) => {
    res.status(error.status || 500).json({ok: false, message: error.message})
})


module.exports = app;