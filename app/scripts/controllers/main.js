'use strict';

angular.module('trackrApp')
    .controller('MainCtrl', function ($scope, Restangular) {
        var userResource = Restangular.all('users');

        userResource.getList().then(function(list){
            $scope.users = list;
        });

        $scope.changeUser = function (user) {
            $scope.currentUser = user;
            $scope.clearTask();
            $scope.reloadTasks();
        };

        $scope.reloadTasks = function() {
            $scope.currentUser.getList('tasks').then(function(tasks){
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
            $scope.currentTask.put().then(function(){
                $scope.reloadTasks();
            })
        };
        $scope.createTask = function () {
            $scope.currentUser.post('tasks', $scope.currentTask).then(function(){
                $scope.reloadTasks();
            })
        };
    });