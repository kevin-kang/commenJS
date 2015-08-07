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
    $.fn.idVerify = function(successcb,errorcb) { //身份证校验
        return this.each(function() {
            var thisVal = $(this).val(),
                thisArr = thisVal.split(''),
                len = thisVal.length,
                wiNum = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                lastwiNum = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
                successcb = successcb || function(){},
                errorcb = errorcb || function(){},
                sumNum = modNum = res = 0;

            if (len != 18) {
                errorcb();
                return 0;
            }

            $.each(thisArr, function(i, k) {
                if (i < 17) {
                    sumNum += parseInt((k * wiNum[i]), 10);
                }
            });

            modNum = sumNum % 11;
            res = lastwiNum[modNum];

            if (res == thisArr[17]) {
                successcb();
                return 1;
            } else {
                errorcb();
                return 0;
            }
        });
    }
}));