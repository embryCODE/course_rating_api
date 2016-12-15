'use strict';

var angular = require('angular');
var app = angular.module('app');

app.config(require('./config'));
// NOTE `constants` is defined in the global namespace within the `index.html`
// in order to make it as easy as possible for the student to change the values
app.constant('constants', constants);
