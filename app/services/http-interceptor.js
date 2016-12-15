'use strict';

function HttpInterceptorService(sessionService, $log) {
  this.request = function(config) {
    var currentUser = sessionService.currentUser;
    
    if (currentUser && currentUser.emailAddress && currentUser.password) {
      var authString = btoa(currentUser.emailAddress + ':' + currentUser.password);
      var headers = config.headers;
      headers['Authorization'] = 'Basic ' + authString;
    }
    
    return config;
  }
}

module.exports = HttpInterceptorService;
