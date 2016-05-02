angular.module('ChartsApp')

.service('data', function ($http, $q, socket) {
  'use strict';
 
  var getData = function () {
    return $http.get("data.json").success(function(data) {
      // json = data;
      socket.emit('updateData', data);
      return data;
    });
  };

  return {
    getData: getData      
  };
});
