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
    $.fn.verifyfullname = function(){
        return this.each(function(i,ele){
            var $target = $(this),
                regfullname = /[^(\u4e00-\u9fa5)+$|^(a-zA-Z)+$]/g;

            $target.on('keyup touchend', function(){
                var thisval = $(this).val();
                
                if(regfullname.test(thisval)){
                    $(this).val(thisval.replace(regfullname, ''));
                }
            })
        });
    }
}));