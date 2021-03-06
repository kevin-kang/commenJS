'use strict';
$.fn.idVerify = function(successcb, errorcb) { //身份证校验

    return this.each(function() {
        let thisVal = $(this).val(),
            thisVal.replace(/x/g, 'X'),
            thisArr = thisVal.split(''),
            len = thisVal.length,
            wiNum = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            lastwiNum = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
            sumNum = 0,
            modNum = 0,
            res = 0;

        if (len != 18) {
            errorcb && errorcb();
            return 0;
        }

        thisArr.forEach((k, i) => {
            if (i < 17) {
                sumNum += parseInt((k * wiNum[i]), 10);
            }
        });

        modNum = sumNum % 11;
        res = lastwiNum[modNum];

        if (res == thisArr[17]) {
            successcb && successcb();
            return 1;
        } else {
            errorcb && errorcb();
            return 0;
        }
    });
}