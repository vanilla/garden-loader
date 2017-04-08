'use strict';

System.register(['./b'], function (_export, _context) {
    "use strict";

    var b;
    function a() {
        return 'a-' + b.default;
    }

    _export('a', a);

    return {
        setters: [function (_b) {
            b = _b;
        }],
        execute: function () {
            _export('default', 'a');
        }
    };
});
