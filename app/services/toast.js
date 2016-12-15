'use strict';

var toastr = require('toastr');

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function ToastService() {
  var _this = this;
  
  _this.success = function(message, title) {
    toastr.success(message, title);
  };

  _this.info = function(message, title) {
    toastr.info(message, title);
  };

  _this.warning = function(message, title) {
    toastr.warning(message, title);
  };

  _this.error = function(message, title) {
    toastr.error(message, title);
  };
}

module.exports = ToastService;
