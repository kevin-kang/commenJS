let tap = (function() {
    let $doc = $(document),
        limt = 30,
        deltaX = 0,
        deltaY = 0,
        tapTimeout,
        touch = {};

    function cancelAll() {
        if(tapTimeout) clearTimeout(tapTimeout);
        tapTimeout = null;
        touch = {};
    }

    $doc.on('touchstart', e => {
        let firstTouch = e.touches[0];

        touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);

        if (e.touches && e.touches.length === 1 && touch.x2) {
            touch.x2 = undefined
            touch.y2 = undefined
        }
        touch.last = Date.now();
        touch.startTime = Date.now();

        touch.x1 = touch.pageX;
        touch.y1 = touch.pageY;

    }).on('touchmove', e => {
        let firstTouch = e.touches[0];

        touch.x2 = firstTouch.pageX;
        touch.y2 = firstTouch.pageY;

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);

    }).on('touchend', e => {
        if (deltaX < limt && deltaY < limt) {
            tapTimeout = setTimeout(() => {
                var tap = $.Event('tap');

                tap.cancelTouch = cancelAll;
                touch.el.trigger(tap);
            }, 0);
        }
        deltaX = deltaY = 0
    }).on('touchcancel', cancelAll);

    $(window).on('scroll', cancelAll);

    $.fn.tap = function(callback) {
        return this.on('tap', callback);
    }
})();

export default tap;