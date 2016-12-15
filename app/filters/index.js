'use strict';

var angular = require('angular');

angular.module('app').filter('lineReturnsToParagraphs', require('./line-returns-to-paragraphs'));
