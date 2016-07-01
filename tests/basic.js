var assert = chai.assert;
var expect = chai.expect;

describe('System', function () {
    it('System should be an object.', function () {
        expect(System).to.be.a('Object');
    });

    it('.import() should be a function.', function () {
        expect(System.import).to.be.a('function');
    });

    it('.importAll() should be a function.', function () {
        expect(System.importAll).to.be.a('function');
    });

    it('.has() should be a function.', function () {
        expect(System.has).to.be.a('function');
    });

    it('.get() should be a function.', function () {
        expect(System.get).to.be.a('function');
    });

    it('.register() should be a function.', function () {
        expect(System.register).to.be.a('function');
    });

});

describe('Promise', function () {
    it('Promise should be a function.', function () {
        expect(Promise).to.be.a('function');
    });
});