'use strict';

System.register(['./anon'], function (_export, _context) {
  "use strict";

  var str;
  return {
    setters: [function (_anon) {
      str = _anon.default;
    }],
    execute: function () {
      _export('default', str + '-dep');
    }
  };
});
