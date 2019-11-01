const express = require('express');

const usersRouter = require('./users');
const moodsRouter = require('./moods');
const reasonsRouter = require('./reasons');
const teamMoodsRouter = require('./team_moods');

module.exports = function iniRouter(app) {
	app.use('/users', usersRouter);
	app.use('/moods', moodsRouter);
	app.use('/reasons', reasonsRouter);
	app.use('/team-moods', teamMoodsRouter);
};