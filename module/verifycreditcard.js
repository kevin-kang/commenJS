;(function(factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD模式
            define(['js/tips'], factory);
        } else {
            // 全局模式
            factory(tips);
        }
    }(function(tips) {
        $.fn.formatcreditcard = function() {
            return this.each(function(i, ele) {
                var regnum = /[^\d+$]/g,
                    $target = $(ele);

                $target.on('keyup touchend', function() {
                    var thisval = $(this).val();

                    $(this).val(thisval.replace(regnum, ''));
                }).on('focusout', function() {
                    var thisval = $(this).val();

                    if (!!thisval) {
                        $(this).val(formatThisCard(thisval));
                    }
                    if (!verifycard(thisval)) {
                        tips.init('卡号错误', 2000);
                    }
                }).on('focusin', function() {
                    $(this).val($(this).val().replace(/ /g, ''));
                });

                function formatThisCard(str) { //格式化卡号
                    var str = $.trim(str);

                    if (!!str) {
                        return str.replace(/(\d{4})/g, '$1 ');
                    }
                }

                function verifycard(str) { //验证卡号是否正确
                    var strArr = str.slice(0, str.length - 1).split(''),
                        tmpArr = [],
                        lastnum = 0;

                    $.each(strArr, function(i) {
                        if (i % 2 == 0) {
                            tmpArr[i] = strArr[i] * 2
                        } else {
                            tmpArr[i] = strArr[i] * 1;
                        }
                    });
                    $.each(tmpArr.join('').split(''), function() {
                        lastnum += this * 1;
                    });
                    if ((lastnum + str.slice(str.length - 1) * 1) % 10 == 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
        }
    });