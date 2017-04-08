'use strict';

System.register(['./a'], function (_export, _context) {
    "use strict";

    var a;
    function b() {
        return 'b-' + a.default;
    }

    _export('b', b);

    return {
        setters: [function (_a) {
            a = _a;
        }],
        execute: function () {
            _export('default', 'b');
        }
    };
});
