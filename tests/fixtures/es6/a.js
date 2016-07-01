'use strict';

System.register(['./b'], function (_export, _context) {
    "use strict";

    var b;
    return {
        setters: [function (_b) {
            b = _b;
        }],
        execute: function () {
            function a() {
                return 'a-' + b.default;
            }

            _export('a', a);

            _export('default', 'a');
        }
    };
});
