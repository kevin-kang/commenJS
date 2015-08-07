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
    $.fn.inputMoney = function() {
        return this.each(function() {
            var target = $(this),
                numberRegexp = /[^\d|\.{1}]+?/g,
                dotRegexp = /[\.]+?/g,
                startZeroNumRegexp = /^0[1-9]+/g,
                isZeroNumRegexp = /^0+/g;

            function isOneDot(){ //只能有一个小数点
                if(target.val().indexOf('.') != -1 && target.val().match(dotRegexp).length != 1){
                   var startPos = target.val().indexOf('.') + 1;
                    target.val(target.val().slice(0, startPos));
                }
            }

            function isNotZeroStart(){ //以0开头的数字则自动转为小数后两位
                if(startZeroNumRegexp.test(target.val())){
                    var nstr = target.val().replace(isZeroNumRegexp,'');
                    target.val('0.' + nstr.slice(0,2));
                }   
            }

            function isNumber(){ //只能输入数字和一个小数点
                target.val(target.val().replace(numberRegexp, ''));
            }
            
            function setZero(){  //开头不能超过连续的两个00
                if(target.val().slice(0,2) == '00'){
                    target.val(0)
                }
            }

            function setBlank(){ //如果为0则设置为空
                if(target.val().replace(dotRegexp, '') == 0){
                    target.val('');
                }
            }

            function maxDotLen() { // 小数最大长度为2
                if (target.val().indexOf('.') != '-1') {
                    var startPos = target.val().indexOf('.') + 3;
                    if (target.val().indexOf('.') != target.val().lastIndexOf('.')) {
                        target.val(target.val().slice(0, startPos));
                    }
                    target.val(target.val().slice(0, startPos));
                }
            }

            function paddedZero() { //自动添加0
                if(target.val().indexOf('.') == 0){
                    target.val('0' + target.val());
                }
                if (target.val().indexOf('.') + 1 == target.val().length) {
                    target.val(target.val() + '00');
                }
                if((target.val().indexOf('.') == 0) && (target.val().indexOf('.') + 1 == target.val().length)){
                    target.val(0);
                }
            }
            //注册目标触发事件
            target.on('keyup', function(){
                isNumber();
                setZero();
                maxDotLen();
                isOneDot();
                isNotZeroStart();
                
            }).on('focusout', function(){
                paddedZero();
                setBlank();
                
            });

        });
    }
}));