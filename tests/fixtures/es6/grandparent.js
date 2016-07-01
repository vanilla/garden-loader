'use strict';

System.register(['./parent'], function (_export, _context) {
  "use strict";

  var parent;
  return {
    setters: [function (_parent) {
      parent = _parent.default;
    }],
    execute: function () {
      _export('default', 'grandparent-' + parent);
    }
  };
});
