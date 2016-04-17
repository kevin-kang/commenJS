'use strict'
let $doc = $(document),
    $win = $(window),
    localArr = [],
    dftopt = {
        url: ''
    },
    selectdropdown = '<div class="autotips"><ul></ul></div>',
    selectbtn = '<label style="position: absolute; right: 2px; top: 0; background: url(css/img/select-icon.png) no-repeat 100% 50%; width: 23px; height: 100%;"></label>',
    selecthidden = '<input type="text" class="selecthidden">';

function renderdropdown(jsonData) { // 渲染下拉框内容dom
    let tmpArr = [];

    jsonData.forEach(ele => {
        var that = ele;

        tmpArr.push(`<li data-value="${that.id}">${that.name}</li>`);
    });
    $doc.find('.autotips ul').html(tmpArr.join('')).children().first().addClass('cur');
}

function renderselect(target) { //初始化下拉框相关dom
    let that = target,
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

function showData(target) {
    let that = target;

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
    Object.assign(dftopt, opt || {});
    return this.each((i, ele) => {
        let that = $(ele),
            idx = 0;

        renderselect(that);

        that.on('keyup focusin', function(e) {
            let data = $(this).val();
            if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                return false;
            }
            if (!that.val()) {
                idx = 0;
                hideData();
                that.parent().find('.selecthidden').val('');
            }
            if (!!that.val()) {

                getData({ //查找数据
                    data: data,
                    url: dftopt.url,
                    cb: res => {
                        if (res.retCode == 2000 && res.data.res.length != 0) {
                            renderdropdown(res.data.res);
                            showData(that);
                        }
                    }
                });
                // getData(data, that);
            }
        }).on('focusout', () => {
            idx = 0;
            setTimeout(hideData, 300);
        });

        function setValue() {
            that.val($doc.find('.autotips .cur').html());
            that.parent().find('.selecthidden').val($doc.find('.autotips .cur').data('value'));
        }

        $doc.on('click', '.autotips li', () => {
            setValue()
            hideData();
        }).on('mouseenter', '.autotips li', function() {
            $(this).addClass('cur').siblings().removeClass('cur');
        }).on('keydown', e => {
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