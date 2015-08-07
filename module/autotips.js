;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD模式
        define(factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function() {
    'use strict'
    var $doc = $(document),
        $win = $(window),
        localArr = [],
        dftopt = {
            url: ''
        },
        selectdropdown = '<div class="autotips"><ul></ul></div>',
        selectbtn = '<label style="position: absolute; right: 2px; top: 0; background: url(css/img/select-icon.png) no-repeat 100% 50%; width: 23px; height: 100%;"></label>',
        selecthidden = '<input type="text" class="selecthidden">';

    function renderdropdown(jsonData) { // 渲染下拉框内容dom
        var tmpArr = [];
        $.each(jsonData, function() {
            var that = this;

            tmpArr.push('<li data-value="' + that.id + '">' + that.name + '</li>');
        });
        $doc.find('.autotips ul').html(tmpArr.join('')).children().first().addClass('cur');
    }

    function renderselect(target) { //初始化下拉框先关dom
        var that = target,
            dname = that.attr('name');

        that.wrap('<span></span>');
        that.parent().css('position', 'relative').append(selecthidden);
        that.after(selectbtn);
        that.next('label').attr('for', dname);
        that.attr({
            'id': dname
        }).removeAttr('name');
        that.parent().find('.selecthidden').attr({
            'name': dname
        }).hide();
        $doc.find('body').append(selectdropdown);
        // console.log($doc.find('.autotips').html());
    }

    function getData(data, that) { //查找数据
        $.ajax({
            url: dftopt.url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                searchName: data
            }
        }).done(function(res) {
            if (res.retCode == 2000 && res.data.res.length != 0) {
                renderdropdown(res.data.res);
                showData(that);
            }
        });
    }

    function showData(target) {
        var that = target;

        $doc.find('.autotips').css({
            'left': that.offset().left,
            'top': that.offset().top + that.outerHeight(),
            'width': that.outerWidth() - 2
        }).show();
    }

    function hideData() {
        $doc.find('.autotips').hide();
    }

    $.fn.autotips = function(opt) {
        $.extend(true, dftopt, opt || {});
        return this.each(function() {
            var that = $(this),
                idx = 0;

            renderselect(that);

            that.on('keyup focusin', function(e) {
                var data = $(this).val();
                if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                    return false;
                }
                if (!that.val()) {
                    idx = 0;
                    hideData();
                    that.parent().find('.selecthidden').val('');
                }
                if (!!that.val()) {
                    getData(data, that);
                }
            }).on('focusout', function() {
                idx = 0;
                setTimeout(hideData, 300);
            });

            function setValue() {
                that.val($doc.find('.autotips .cur').html());
                that.parent().find('.selecthidden').val($doc.find('.autotips .cur').data('value'));
            }

            $doc.on('click', '.autotips li', function() {
                setValue()
                hideData();
            }).on('mouseenter', '.autotips li', function() {
                $(this).addClass('cur').siblings().removeClass('cur');
            }).on('keydown', function(e) {
                if (e.keyCode == 38 && $(e.target).is(that)) { //上方向
                    e.preventDefault();
                    idx--;
                    if (idx < 0) {
                        idx = $doc.find('.autotips li').length - 1;
                    }
                    $doc.find('.autotips li').eq(idx).addClass('cur').siblings().removeClass('cur');
                    return false;
                }
                if (e.keyCode == 40 && $(e.target).is(that)) { //下方向
                    e.preventDefault();
                    idx++;
                    if (idx == $doc.find('.autotips li').length) {
                        idx = 0;
                    }
                    $doc.find('.autotips li').eq(idx).addClass('cur').siblings().removeClass('cur');
                    return false;
                }
                if (e.keyCode == 13 && $(e.target).is(that) && $(e.target).val()) {
                    setValue();
                    hideData();
                }
            });
        });
    };
}));