angular.module('UpGuardApp')
.directive('treeChart', function(socket) {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    template: '<div id="graph"></div>',
    scope:{
      data: '='
    },
    link: function(scope, element) {
      var chart = d3.chart.treeChart();

      scope.$watch("data", function(data) {
        if (typeof (data) === 'undefined') {
          return;
        }
        chart.diameter(1000)
          .data(scope.data);

        d3.select(element[0])
          .call(chart);
      });

      socket.on('select', function(name) {
        chart.select(name);
      });

      socket.on('unselect', function() {
          chart.unselect();
      });
    }
  };
});
