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
    $.fn.extselect = function() {
        return this.each(function() {
            var $target = $(this),
                $select = $target.find('select'),
                $selecttxt = '',
                txtbox = '<span class="selecttxt"></span>';

            $(txtbox).appendTo($target);
            $selecttxt = $target.find('.selecttxt');

            $target.on('click', function() {
                $(this).addClass('cur');
            });
            $select.on('change', function() {
                $selecttxt.html($(this).children(':selected').text());
            }).on('focusout', function() {
                $target.removeClass('cur');
            }).change();
        });
    }
}));