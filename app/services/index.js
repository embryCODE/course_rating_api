'use strict';

var angular = require('angular');
var app = angular.module('app');

app.service('authService', require('./auth'));
app.service('errorHandlerService', require('./error-handler'));
app.service('httpInterceptorService', require('./http-interceptor'));
app.service('sessionService', require('./session'));
app.service('showdownService', require('./showdown'));
app.service('toastService', require('./toast'));
app.service('validationService', require('./validation'));
