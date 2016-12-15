'use strict';

var angular = require('angular');
var app = angular.module('app');

app.directive('markdown', require('./markdown'));
app.directive('rating', require('./rating'));
app.directive('userNav', require('./user-nav'));
app.directive('validationErrors', require('./validation-errors'));
