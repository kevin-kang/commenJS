$.fn.formatcreditcard = function(success, error) {
    return this.each((i,ele) => {
        let regnum = /[^\d+$]/g,
            $target = $(ele);

        $target.on('keyup touchend', function() {
            var thisval = $(this).val();

            $(this).val(thisval.replace(regnum, ''));
        }).on('focusout', function() {
            var thisval = $(this).val();

            if (!!thisval) {
                $(this).val(formatThisCard(thisval));
            }
            if (verifycard(thisval)) {
                success && success(ele);
            } else if (thisval.slice(0, 1) > 2) {
                error && error(ele);
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
            if (!str) {
                return 0;
            }
            var strArr = str.split('').reverse(),
                oddArr = [],
                evenArr = [],
                oddRes = 0,
                evenRes = 0;

            $.each(strArr, function(i) {
                if ((i + 1) % 2 == 0) {
                    evenArr.push(strArr[i] * 2)
                } else {
                    oddArr.push(strArr[i] * 1);
                }
            });

            $.each(oddArr.join('').split(''), function() {
                oddRes += this * 1;
            });
            $.each(evenArr.join('').split(''), function() {
                evenRes += this * 1;
            });
            if ((oddRes + evenRes) % 10 == 0) {
                return 1;
            } else {
                return 0;
            }
        }
    });
};