'use strict';
let addZero = time => {
    return time < 10 ? '0' + time : time;
};

$.fn.cuttime = function(stime, etime) {
    return this.each(function(){

        let $this = $(this),
            diffDate = Math.abs(etime - stime),
            diffHoures = parseInt(diffDate / 3600000, 10),
            diffMinutes = parseInt(diffDate / 1000 / 60 % 60, 10),
            diffseconds = parseInt(diffDate / 1000 % 60, 10),
            thisTimeId = 0;
        if (etime - stime < 0 || etime == stime) {
            $this.html('00:00:00');
            return false;
        }
        let updataTime = () => {
            diffseconds--;

            if (diffHoures > 0 && diffMinutes == 0 && diffseconds < 0) {
                --diffHoures;
                diffMinutes = 59;
                diffseconds = 59;
            }
            if (diffMinutes > 0 && diffseconds < 0) {
                --diffMinutes;
                diffseconds = 59;
            }
            if (diffMinutes < 0) {
                diffMinutes = 0;
            }
            $this.html(addZero(diffHoures) + ':' + addZero(diffMinutes) + ':' + addZero(diffseconds));

            thisTimeId = setTimeout(updataTime, 1000);

            if (diffseconds == 0 && diffMinutes == 0 && diffHoures == 0) {
                clearTimeout(thisTimeId);
            }
        }

        updataTime();
    });
}