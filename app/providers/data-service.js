'use strict';

var dataService = require('./data');
var mockDataService = require('./mock-data');

function DataServiceProvider() {
  
  
  this.$get = ['constants', 'coursesData', 'usersData', '$http', 
    function(constants, coursesData, usersData, $http) {
      if (constants.useMockData) {
        return new mockDataService(coursesData, usersData);
      } else {
        return new dataService($http);
      }    
  }];
}

module.exports = DataServiceProvider;
