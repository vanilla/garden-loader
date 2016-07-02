var assert = chai.assert;

describe('Mixed Loading', function () {
    this.timeout(10000);

    it('System.import() should import a mix of AMD, ES6, and external modules.', function () {
        System.set('ext/rickard', {default: 'Rickard'});

        return System.import('es6/jon').then(function (mod) {
            assert.equal(mod.default, '(Rickard->Lyanna) + (Aerys II->Rhaegar) = Jon');
        });
    });
});