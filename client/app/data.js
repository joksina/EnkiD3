angular.module('cyber', [])
  .controller('DataCtrl', function($scope, $window, $location, Nodes) {
    $scope.data = [];

    Nodes.getData().then(function(node){
      $scope.data = node;
      console.log(node);
    })
  })