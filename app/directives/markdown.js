'use strict';

// this directive was inspired by this custom directive:
// https://github.com/btford/angular-markdown-directive
function Markdown($sanitize, showdownService) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      if (attrs.markdown) {
        var converter = showdownService.getConverter();
        scope.$watch(attrs.markdown, function (newVal) {
          var html = newVal ? $sanitize(converter.makeHtml(newVal)) : '';
          element.html(html);
        });
      }
    }
  };
}

module.exports = Markdown;
