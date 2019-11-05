const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./users');
const moodsRouter = require('./moods');
const reasonsRouter = require('./reasons');
const teamMoodsRouter = require('./team_moods');

const mongoStatusCodes = ["Disconnected", "Connected", "Connecting", "Disconnected"];

module.exports = function iniRouter(app) {
	app.use('/users', usersRouter);
	app.use('/moods', moodsRouter);
	app.use('/reasons', reasonsRouter);
	app.use('/team-moods', teamMoodsRouter);
	app.use('/', function(req, res, next){
		res.status(200);
		res.json({
			App_Status : "UP",
			MongoDB_Connection_Status : mongoStatusCodes[mongoose.connection.readyState],
			Link_to_API_Documentation : "https://documenter.getpostman.com/view/6477566/SVtZvRrJ?version=latest"			
		});
	});
};