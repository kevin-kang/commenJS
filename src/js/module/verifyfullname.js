'use strict';
$.fn.verifyfullname = function() {
    return this.each(function(i, ele) {
        let $target = $(this),
            regfullname = /[^(\u4e00-\u9fa5)+$|^(a-zA-Z)+$]/g;

        $target.on('keyup touchend', function() {
            let thisval = $(this).val();

            if (regfullname.test(thisval)) {
                $(this).val(thisval.replace(regfullname, ''));
            }
        })
    });
}