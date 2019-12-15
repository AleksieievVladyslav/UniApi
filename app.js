const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./app/routers/user');

const app = express()
    .use(bodyParser.urlencoded({ extended: false }))
    .use('/user', userRouter)


module.exports = app;