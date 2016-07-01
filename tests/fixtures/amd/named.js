define('amd/named', function () {
    return 'amd/named';
});

define('amd/named-dep', ['./named', './anon-dep'], function (dep1, dep2) {
    return {
        dep1: dep1,
        dep2: dep2
    };
});