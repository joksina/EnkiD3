angular.module('ChartsApp')
.service('socket', function ($http, $q) {
  'use strict';

  var subscribers = {};

  var on = function(eventName, callback) {
    if (!subscribers[eventName]) {
      subscribers[eventName] = [];
    }
    subscribers[eventName].push(callback);
  };

  var emit = function(eventName, body) {
    if (!subscribers[eventName]) {
      return false;
    }
    subscribers[eventName].forEach(function(callback) {
      callback(body);
    });
    return true;
  };

  return {
    on: on,
    emit: emit
  };
});
