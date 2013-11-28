'use strict';

angular.module('trackrApp')
    .controller('MainCtrl', function ($scope, Restangular) {
        var userResource = Restangular.all('users');
        var projectResource = Restangular.all('projects');
        $scope.nameCreate="";
        $scope.filter="";

        $scope.createUser = function () {
            userResource.post({name: $scope.nameCreate});
            $scope.nameCreate="";
            $scope.reloadUsers();
        };

        $scope.createProject = function () {
            projectResource.post({name: $scope.nameCreate});
            $scope.nameCreate="";
            $scope.reloadProjects();
        };

        $scope.reloadUsers = function () {
            var params = {sort:'name'};
            if ($scope.filter!="") {
                params.conditions = JSON.stringify({name:{$regex:$scope.filter}});
            }
            userResource.getList(params).then(function (list) {
                $scope.users = list;
            });
        };
        $scope.reloadProjects = function () {
            projectResource.getList({sort:'name'}).then(function (list) {
                $scope.projects = list;
            });
        };

        $scope.reloadUsers();
        $scope.reloadProjects();

        $scope.changeUser = function (user) {
            $scope.currentUser = user;
            $scope.currentProjects = {};
            _.each(user.projects, function (id) {
                $scope.currentProjects[id] = true;
            });
            $scope.clearTask();
            $scope.reloadTasks();
        };

        $scope.reloadTasks = function () {
            $scope.currentUser.getList('tasks').then(function (tasks) {
                $scope.currentTasks = tasks;
            })
        };

        $scope.changeTask = function (task) {
            $scope.currentTask = task.clone();
        };
        $scope.clearTask = function () {
            $scope.currentTask = {};
        };
        $scope.updateTask = function () {
            $scope.currentTask.put().then(function () {
                $scope.reloadTasks();
            })
        };
        $scope.createTask = function () {
            $scope.currentUser.post('tasks', $scope.currentTask).then(function () {
                $scope.reloadTasks();
                $scope.clearTask();
            })
        };

        $scope.toggleProject = function (id) {
            if ($scope.currentProjects[id]) {
                $scope.currentUser.projects.push(id);
            } else {
                $scope.currentUser.projects = _.without($scope.currentUser.projects, id);
            }
            delete $scope.currentUser.__v;
            $scope.currentUser.put();
        };
    });