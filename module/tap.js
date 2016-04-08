exports.tap = (function() {
    var $doc = $(document),
        startTime = '',
        endTime = '',
        limt = 60,
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0,
        isMove = false,
        tap = $.Event('tap');

    $doc.on('touchstart', function(e) {
        var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : (e.changedTouches ? e.changedTouches[0] : e);

        starTime = Date.now();
        x1 = touch.pageX;
        y1 = touch.pageY;

    }).on('touchmove', function(e) {
        var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : (e.changedTouches ? e.changedTouches[0] : e);

        if (touch.pageX - x1 > limt || touch.pageY - y1 > limt) {
            e.stopPropagation();
            isMove = true;
        }

    }).on('touchend', function(e) {

        endTime = e.timeStamp;

        if (!isMove && endTime - starTime <= 200) {
            setTimeout(function(){
                $(e.target).trigger(tap);
                if(tap.isDefaultPrevented()){
                    e.preventDefault();
                }
                e.stopPropagation();
            }, 50);            
        } else {
            isMove = false;
        }
    });
})();