'use strict';
let $win = $(window),
    $doc = $(document),
    $bh = $('body, html'),
    sTopZero = isToped = 0,
    backTopSet = speed => {
        if (!isToped) {
            isToped = 1;
            $bh.animate({
                scrollTop: sTopZero
            }, speed, function() {
                isToped = 0;
            });
        }
    },
    fadeBackTop = ele => {
        $win.scroll(function(event) {
            if ($(this).scrollTop() > 100) {
                $doc.find(ele).stop(true, false).fadeIn();
            } else {
                $doc.find(ele).stop(true, false).fadeOut();
            }
        }).scroll();
    },
    backTop = (ele, speed) => { // 返回顶部按钮及速度
        $doc.on('click', ele,() => {
            backTopSet(speed);
        });
        fadeBackTop(ele);
    }

export default backTop;