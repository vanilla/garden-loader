"use strict";

System.register("es6/named-dep", ["./named", "./anon-dep"], function (_export, _context) {
  "use strict";

  var dep1, dep2;
  return {
    setters: [function (_named) {
      dep1 = _named.default;
    }, function (_anonDep) {
      dep2 = _anonDep.default;
    }],
    execute: function () {
      _export("default", { dep1: dep1, dep2: dep2 });
    }
  };
});
