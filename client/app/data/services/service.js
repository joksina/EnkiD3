angular.module('UpGuardApp')

.service('data', function ($http, socket) {
  'use strict';
 
  var getData = function () {
    return $http.get("data.json").success(function(data) {
      socket.emit('update', data);
      if(typeof data.children === false && typeof data.children === 0) {
        JSON.stringify(data);
      }
      return data;
    });
  };

  return {
    getData: getData      
  };
});
