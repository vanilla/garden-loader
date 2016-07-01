'use strict';

System.register(['./lyanna', 'amd/rhaegar'], function (_export, _context) {
  "use strict";

  var lyanna, rhaegar;
  return {
    setters: [function (_lyanna) {
      lyanna = _lyanna.default;
    }, function (_amdRhaegar) {
      rhaegar = _amdRhaegar.default;
    }],
    execute: function () {
      _export('default', '(' + lyanna + ') + (' + rhaegar + ') = Jon');
    }
  };
});
