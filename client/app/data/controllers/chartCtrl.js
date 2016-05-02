angular.module('UpGuardApp')
.controller('chartCtrl', function ($scope, socket) {
  'use strict';

  socket.on('update', function(data) {
    $scope.data = angular.copy(data);
  });
});
