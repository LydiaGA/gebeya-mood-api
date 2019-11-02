const express = require('express');

const usersRouter = require('./users');
const moodsRouter = require('./moods');
const reasonsRouter = require('./reasons');
const teamMoodsRouter = require('./team_moods');

module.exports = function iniRouter(app) {
	app.use('/', function(req, res, next){
		res.status(200);
		res.json("Link to API Documentation : https://documenter.getpostman.com/view/6477566/SVtZvRrJ?version=latest");
	});
	app.use('/users', usersRouter);
	app.use('/moods', moodsRouter);
	app.use('/reasons', reasonsRouter);
	app.use('/team-moods', teamMoodsRouter);
};