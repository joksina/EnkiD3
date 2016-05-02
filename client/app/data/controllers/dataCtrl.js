angular.module('ChartsApp')

.controller('detailCtrl', function ($scope, data, socket) {
    'use strict';

 angular.element(document.querySelector('#panel'))
  .on('hoverNode', function(e) {
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

  socket.on('updateData', function(data) {
    $scope.data = angular.copy(data);
  });

  var getNode = function(name, data) {
    if (data.name === name) {
      return data;
    }
    if (!data.children) return null;
    for (var i = data.children.length - 1; i >= 0; i--) {
      var matchingNode = getNode(name, data.children[i]);
      if (matchingNode) return matchingNode;
    }
  };    
});
