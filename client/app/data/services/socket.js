angular.module('UpGuardApp')
.service('socket', function ($http) {
  'use strict';

  var socket = {};

  var on = function(eventName, callback) {
    if (!socket[eventName]) {
      socket[eventName] = [];
    }
    socket[eventName].push(callback);
  };

  var emit = function(eventName, body) {
    socket[eventName].forEach(function(callback) {
      callback(body);
    });
  };

  return {
    on: on,
    emit: emit
  };
});
