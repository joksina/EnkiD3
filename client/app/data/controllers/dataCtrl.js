angular.module('UpGuardApp')

.controller('detailCtrl', function ($scope, data, socket) {
    'use strict';

 angular.element(document.querySelector('#panel'))
  .on('hover', function(e) {
    $scope.node = getNode(e.detail, $scope.data);
    $scope.detail = true;
    $scope.$digest();
  })
  .on('selectNode', function(e) {
    $scope.$digest();
  })
  .on('unSelectNode', function(e) {
    $scope.$digest();
  });

  socket.on('update', function(data) {
    $scope.data = angular.copy(data);
  });

//searching the tree
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
        return match;
      }
    }
  };    
});
