var assert = chai.assert;

describe('Mixed Loading', function () {
    it('System.import() should import a mix of AMD, ES6, and external modules.', function () {
        System.set('ext/rickard', {default: 'Rickard'});

        return System.import('es6/jon').then(function (mod) {
            assert.equal(mod.default, '(Rickard->Lyanna) + (Aerys II->Rhaegar) = Jon');
        });
    });

    it('System.importAll() should load AMD modules and ES6 modules.', function () {
        return System.importAll('react', 'es6/component', 'es6/component.React').spread(
            function (React, Component, React2) {
                assert.isFalse(React === undefined);
            }
        );
    })
});