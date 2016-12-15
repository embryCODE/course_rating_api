'use strict';

function ErrorHandler(toastService, $log) {
  var _this = this;
  
  _this.handleError = function(response, displayValidationErrorsCallback) {
    if (response.status === 400 && displayValidationErrorsCallback) {
      displayValidationErrorsCallback(response.data);
    } else {
      var message = response && response.data && response.data.message;
      if (!message) {
        message = 'Message not available. Please see the console for more details.';
      }
      toastService.error(message, 'Unexpected Error');

      // log the entire response to the console
      $log.error(response);
    }
  };
}

module.exports = ErrorHandler;
