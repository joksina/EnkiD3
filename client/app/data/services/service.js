angular.module('UpGuardApp')

.service('data', function ($http, socket) {
  'use strict';
 
  var getData = function () {
    return $http.get("data.json").success(function(data) {
      socket.emit('update', data);
      return data;
    });
  };

  return {
    getData: getData      
  };
});
