const express = require('express');

const usersRouter = require('./users');

module.exports = function iniRouter(app) {

	app.use('/users', usersRouter);

};