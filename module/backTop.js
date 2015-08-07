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
    var $win = $(window),
        $doc = $(document),
        $bh = $('body, html'),
        sTopZero = isToped = 0;

    function backTopSet(speed) {
        if (!isToped) {
            isToped = 1;
            $bh.animate({
                scrollTop: sTopZero
            }, speed, function() {
                isToped = 0;
            });
        }
    }

    function fadeBackTop(ele){
        $win.scroll(function(event) {
           if($(this).scrollTop() > 100){
                $doc.find(ele).stop(true, false).fadeIn();
           }else{
                $doc.find(ele).stop(true, false).fadeOut();
           }
        }).scroll();
    }

    return function(ele, speed){ // 返回顶部按钮及速度
        $(function(){
            $doc.on('click', ele, function() {
                backTopSet(speed);
            });
            fadeBackTop(ele);
        });
        
    }

}));