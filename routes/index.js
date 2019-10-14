const express = require('express');

const usersRouter = require('./users');
const moodsRouter = require('./moods');
const reasonsRouter = require('./reasons');

module.exports = function iniRouter(app) {
	app.use('/users', usersRouter);
	app.use('/moods', moodsRouter);
	app.use('/reasons', reasonsRouter);
};