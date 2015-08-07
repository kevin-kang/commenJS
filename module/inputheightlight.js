;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD模式
        define(factory);
    } else {
        // 全局模式
        factory();
    }
}(function(){
    'use strict';
    var $doc = $(document),
        input = 'input';

    $doc.on('focusin', input, function(){
        $(this).addClass('cur');
    }).on('focusout', input, function(){
        $(input).removeClass('cur');
    });
}));