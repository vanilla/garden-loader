var assert = chai.assert;

describe('External Registry', function () {
    it('System.get() should return undefined on a module that doesn\'t exist', function () {
        assert.isUndefined(System.get('asdf'));
    });

    it('System.set() should match System.get().', function () {
        var val = {a: true};
        System.set('ss', val);
        assert.equal(val, System.get('ss'));
    });

    it('System.has() should work on set modules.', function () {
        var val = {a: true};
        assert.isFalse(System.has('sys-has'));
        System.set('sys-has', val);
        assert.isTrue(System.has('sys-has'));
    });

    it('System.set() should override System.import()', function () {
        return System.import('amd/anon').then(function (mod) {
            assert.equal(mod.default, 'amd/anon');

            var val = {a: true};
            System.set('amd/anon', val);
            assert.equal(val, System.get('amd/anon'));
        });
    });
});
