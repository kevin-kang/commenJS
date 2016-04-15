/**
 * [swipe 事件扩展]
 * swipeup       上滑事件
 * swipedown     下滑事件
 * swipeleft     左滑事件
 * swiperight    右滑事件
 */
'use strict';
let swipe = (function() {
    var x = 80,
        y = 80,
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0,
        isMove = false,
        $doc = $(document);

    function start(e) {
        var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : (e.changedTouches ? e.changedTouches[0] : e);
        x1 = touch.pageX;
        y1 = touch.pageY;
    };

    function stop(e) {
        var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : (e.changedTouches ? e.changedTouches[0] : e);
        x2 = touch.pageX;
        y2 = touch.pageY;
    };

    function ismove() {
        if (!isMove) {
            isMove = true;
        }
    };

    function direction(e) {
        var dir = '';
        if (Math.abs(x2 - x1) < x && Math.abs(y2 - y1) > 30) {
            dir = y1 < y2 ? 'down' : 'up';
        } else if (Math.abs(x2 - x1) > 30 && Math.abs(y2 - y1) < y) {
            dir = x1 < x2 ? 'right' : 'left';
        }
        switch (dir) {
            case 'up':
                $(e.target).trigger('swipeup');
                break;
            case 'down':
                $(e.target).trigger('swipedown');
                break;
            case 'left':
                $(e.target).trigger('swipeleft');
                break;
            case 'right':
                $(e.target).trigger('swiperight');
                break;
        }
    };

    $doc.on('touchstart mousedown', function(e) {
        e.stopPropagation();
        start(e);
    }).on('touchmove mousemove', function(e) {
        e.stopPropagation();
        e.preventDefault();
        ismove();
    }).on('touchend mouseup', function(e) {
        if (!isMove) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        stop(e);
        direction(e);
        isMove = false;
    });

})();

export default swipe;