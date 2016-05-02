angular.module('ChartsApp')
.controller('chartCtrl', function ($scope, socket) {
  'use strict';

  socket.on('updateData', function(data) {
    $scope.data = angular.copy(data);
  });
});
