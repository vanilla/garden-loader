'use strict';

System.register(['./child'], function (_export, _context) {
  "use strict";

  var child;
  return {
    setters: [function (_child) {
      child = _child.default;
    }],
    execute: function () {
      _export('default', 'parent-' + child);
    }
  };
});
