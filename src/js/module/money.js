'use strict';
$.fn.inputMoney = function() {
    return this.each((i,ele) => {
        let target = $(ele),
            numberRegexp = /[^\d|\.{1}]+?/g,
            dotRegexp = /[\.]+?/g,
            startZeroNumRegexp = /^0[1-9]+/g,
            isZeroNumRegexp = /^0+/g,
            isOneDot = () => { //只能有一个小数点
                if (target.val().indexOf('.') != -1 && target.val().match(dotRegexp).length != 1) {
                    let startPos = target.val().indexOf('.') + 1;
                    target.val(target.val().slice(0, startPos));
                }
            },
            isNotZeroStart = () => { //以0开头的数字则自动转为小数后两位
                if (startZeroNumRegexp.test(target.val())) {
                    let nstr = target.val().replace(isZeroNumRegexp, '');
                    target.val('0.' + nstr.slice(0, 2));
                }
            },
            isNumber = () => { //只能输入数字和一个小数点
                target.val(target.val().replace(numberRegexp, ''));
            },
            setZero = () => { //开头不能超过连续的两个00
                if (target.val().slice(0, 2) == '00') {
                    target.val(0)
                }
            },
            setBlank = () => { //如果为0则设置为空
                if (target.val().replace(dotRegexp, '') == 0) {
                    target.val('');
                }
            },
            maxDotLen = () => { // 小数最大长度为2
                if (target.val().indexOf('.') != '-1') {
                    let startPos = target.val().indexOf('.') + 3;
                    if (target.val().indexOf('.') != target.val().lastIndexOf('.')) {
                        target.val(target.val().slice(0, startPos));
                    }
                    target.val(target.val().slice(0, startPos));
                }
            },
            paddedZero = () => { //自动添加0
                if (target.val().indexOf('.') == 0) {
                    target.val('0' + target.val());
                }
                if (target.val().indexOf('.') + 1 == target.val().length) {
                    target.val(target.val() + '00');
                }
                if ((target.val().indexOf('.') == 0) && (target.val().indexOf('.') + 1 == target.val().length)) {
                    target.val(0);
                }
            };

        //注册目标触发事件
        target.on('keyup', () => {
            isNumber();
            setZero();
            maxDotLen();
            isOneDot();
            isNotZeroStart();

        }).on('focusout', () => {
            paddedZero();
            setBlank();

        });

    });
}