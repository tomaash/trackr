var express = require('express'),
    routes = require('./routes'),
    path = require('path');

var app = express();
app.directory = __dirname;

require('./config/environments')(app);
require('./routes')(app);

var mongoose = require('mongoose');
var baucis = require('baucis');

mongoose.connect('mongodb://localhost/trackr');

var User = new mongoose.Schema({
    name: String,
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
});
var Task = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var Project = new mongoose.Schema({
    name: String
});

mongoose.model('user', User);
mongoose.model('task', Task);
mongoose.model('project', Project);

var userController = baucis.rest('user');
var taskController = baucis.rest('task');
var projectController = baucis.rest('project');

var taskSubcontroller = baucis.rest({
    singular: 'task',
    basePath: '/:user/tasks',
    publish: false
});

taskSubcontroller.query(function (request, response, next) {
    if (request.baucis.query) {
        request.baucis.query.where('user', request.params.user);
    }
    if (request.body && !request.body.user) {
        request.body.user = request.params.user;
    }
    next();
});

taskSubcontroller.initialize();

userController.use(taskSubcontroller);

app.use('/api/v1', baucis());

module.exports = app;
