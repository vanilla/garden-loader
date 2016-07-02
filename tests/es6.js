var assert = chai.assert;

describe('ES6 Loading', function () {
    it('System.import() should import anonymous ES6 modules.', function () {
        return System.import('es6/anon').then(function (mod) {
            assert.equal(mod.default, 'es6/anon');
        });
    });

    it('System.import() should import anonymous ES6 modules with dependencies.', function () {
        return System.import('es6/anon-dep').then(function (mod) {
            assert.equal(mod.default, 'es6/anon-dep');
        })
    });

    it('System.import() should import multiple, named ES6 modules.', function () {
        return System.import('es6/named').then(function (mod) {
            assert.equal(mod.default, 'es6/named');
        }).then(function () {
            return System.import('es6/named-dep').then(function (mod) {
                assert.equal(mod.default.dep1, 'es6/named');
                assert.equal(mod.default.dep2, 'es6/anon-dep');
            });
        });
    });

    it('System.import() should load dependencies of dependencies.', function () {
        return System.import('es6/grandparent').then(function (mod) {
            assert.equal(mod.default, 'grandparent-parent-child');
        });
    });

    it('System.import() should properly resolve cyclic dependencies.', function () {
        return Promise.all([
            System.import('es6/a'),
            System.import('es6/b')
        ]).then(function (mods) {
            var a = mods[0], b = mods[1];

            assert.equal(a.a(), 'a-b');
            assert.equal(b.b(), 'b-a');
        });
    });

    it('System.has() should work on ES6 modules.', function () {
        assert.isFalse(System.has('es6/has'));
        return System.import('es6/has', function (has) {
            assert.isTrue(System.has('es6/has'));
        });
    });
});