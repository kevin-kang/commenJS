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
    var isload = 0;
    
    return function getmore(url, data, cb){
        var cb = cb || function(){};

        if(!isload){
            isload = 1;
            $.ajax({
                url: url, //页数URL
                type: 'GET',
                dataType: 'jsonp',
                data: data
            }).done(function(res) {
                cb(res);
                isload = 0;
            });
        }
    };
}));