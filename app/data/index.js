'use strict';

var angular = require('angular');
var app = angular.module('app');

app.service('coursesData', require('./courses'));
app.service('usersData', require('./users'));
