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

var User = new mongoose.Schema({name: String});
var Task = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('user', User);
mongoose.model('task', Task);

var taskSubcontroller = baucis.rest({
    singular: 'task',
    basePath: '/:_id/tasks',
    publish: false
});

taskSubcontroller.query(function (request, response, next) {
    request.baucis.query.where('user', request.params._id);
    next();
});

taskSubcontroller.initialize();

var userController = baucis.rest('user');
var taskController = baucis.rest('task');

userController.use(taskSubcontroller);

app.use('/api/v1', baucis());

module.exports = app;
