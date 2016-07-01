'use strict';

System.register(['./a'], function (_export, _context) {
    "use strict";

    var a;
    return {
        setters: [function (_a) {
            a = _a;
        }],
        execute: function () {
            function b() {
                return 'b-' + a.default;
            }

            _export('b', b);

            _export('default', 'b');
        }
    };
});
