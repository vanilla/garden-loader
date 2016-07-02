var assert = chai.assert;

describe('AMD Loading', function () {
    this.timeout(5000);
    
    it('System.import() should import anonymous AMD modules.', function () {
        return System.import('amd/anon').then(function (mod) {
            assert.equal(mod.default, 'amd/anon');
        });
    });

    it('System.import() should import anonymous AMD modules with dependencies.', function () {
        return System.import('amd/anon-dep').then(function (mod) {
            assert.equal(mod.default, 'amd/anon-dep');
        })
    });

    it('System.import() should import multiple, named AMD modules.', function () {
        return System.import('amd/named').then(function (mod) {
            assert.equal(mod.default, 'amd/named');
        }).then(function () {
            return System.import('amd/named-dep').then(function (mod) {
                assert.equal(mod.default.dep1, 'amd/named');
                assert.equal(mod.default.dep2, 'amd/anon-dep');
            });
        });
    });

    it('System.import() should load dependencies of dependencies.', function () {
        return System.import('amd/grandparent').then(function (mod) {
            assert.equal(mod.default, 'grandparent-parent-child');
        });
    });

    it('System.has() should work on AMD modules.', function () {
        assert.isFalse(System.has('amd/has'));
        return System.import('amd/has', function (has) {
            assert.isTrue(System.has('amd/has'));
        });
    });
});