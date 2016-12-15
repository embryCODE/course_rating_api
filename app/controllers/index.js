'use strict';

var angular = require('angular');
var app = angular.module('app');

app.controller('CoursesController', require('./courses'));
app.controller('CourseDetailController', require('./course-detail'));
app.controller('CourseEditController', require('./course-edit'));
app.controller('MockDataAlertController', require('./mock-data-alert'));
app.controller('SignInController', require('./sign-in'));
app.controller('SignOutController', require('./sign-out'));
app.controller('SignUpController', require('./sign-up'));
