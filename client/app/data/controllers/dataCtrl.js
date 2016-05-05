angular.module('UpGuardApp')

.controller('detailCtrl', function ($scope, data, socket) {
    'use strict';

 angular.element(document.querySelector('#panel'))
  .on('hover', function(e) {
    $scope.node = getNode(e.detail, $scope.data);
    $scope.detail = true;
    $scope.$digest();
  })

  socket.on('update', function(data) {
    $scope.data = angular.copy(data);
  });

  var getNode = function(name, data) {
    if (data.name === name) {
      return data;
    }
    if (!data.children){
      return null;
    }
    for (var i = 0; i < data.children.length; i++) {
      var match = getNode(name, data.children[i]);
      if (match) {
        if(typeof match.value === false){
          JSON.parse(match.value);
        }
        // console.log(match.value);
        return match;
      }
    }
  };    
});
