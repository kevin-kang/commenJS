'use strict';
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD模式
        define(factory);
    } else {
        // 全局模式
        factory();
    }
}(function() {
    function globalEval(str) {
        new Function(str)();
    }
    return globalEval;
});