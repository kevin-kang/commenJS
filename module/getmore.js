;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD模式
        define(factory);
    } else {
        // 全局模式
        factory();
    }
}(function() {
    'use strict';
    var isload = 0;

    return function getData(opt) {
        var opt = $.extend({
            data: '',
            url: '',
            type: 'GET',
            dataType: 'jsonp',
            cb: cb || function() {}
        }, opt || {});

        if (!isload) {
            isload = 1;
            $.ajax({
                url: url, //页数URL
                type: opt.type,
                dataType: opt.dataType,
                data: opt.data
            }).done(function(res) {
                opt.cb(res);
                isload = 0;
            });
        }
    };
}));