'use strict';

function SignOutController(authService, $location) {
  authService.signOut();
  $location.path('/');
}

module.exports = SignOutController;
