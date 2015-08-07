;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD模式
        define(factory);
    } else {
        // 全局模式
        factory();
    }
}(function() {
    'use strict';
    function tipsMod(str,time) { // 提示模块
        var $doc = $(document),
            $body = $('body'),
            tips = '<div class="tips"></div>',
            $tips = '',
            time = time || 3000;

        if($doc.find('.tips').length == 0){
            $body.append(tips);
        } 
        $tips = $doc.find('.tips');

        if (str) {
            $tips.html(str);
        }

        if (!$tips.data('ends')) {
            $tips.data('ends',1);
            $tips.show().addClass('bounceIn').on('webkitAnimationEnd', function(event) {
                $(this).removeClass('bounceIn').addClass('bounceOut');
            });
            setTimeout(function() {
                $tips.removeClass('bounceOut').remove();
                $tips.data('ends',0);
            }, time);
        }
    }
    return {
        init: tipsMod
    };
}));