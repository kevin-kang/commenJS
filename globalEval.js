define(function() {
    'use strict';

    function globalEval(str) {
        new Function(str)();
    }
    return globalEval;
});