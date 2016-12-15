'use strict';

function LineReturnsToParagraphs() {
  return function (input) {
    if (input) {
      return '<p>' + input.replace(/\n\n/g, '</p><p>') +'</p>';
    } else {
      return input;
    }
  }
}

module.exports = LineReturnsToParagraphs;
