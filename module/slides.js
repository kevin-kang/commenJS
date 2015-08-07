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
    $.fn.slides = function(option) {
        var option = $.extend({
            preload: false, // boolean, 关闭预载入动画
            cusControl: false, // boolean, 关闭自定义切换按钮容器
            height: 350, // number, 必填，容器高度
            width: 560, // number, 必填，容器宽度
            control: 'pagination', // string, 切换按钮容器类名
            current: 'current', // string, 切换按钮高亮类名
            preloadImage: 'http://p4.qhimg.com/d/inn/b2799be7/loading.gif', // string, 预载入动画图片
            container: 'slide_cont', // string, 动画容器类名
            nextBtn: 'next', // string, 下一帧按钮类名
            prevBtn: 'prev', // string, 上一帧按钮类名
            fadeSpeed: 500, // number, fade动画速度
            fadeEasing: '', // string, 必须导入动画函数 jquery.easing.1.3.js
            slideSpeed: 500, // number, slide动画速度
            slideEasing: '', // string, 必须导入动画函数 jquery.easing.1.3.js
            start: 1, // number, 显示图片为第一张
            direction: 'next', // string, 'next, top, prev, bottom' 动画切换方向
            effect: 'slide', // string, 'slide, fade' 动画切换效果
            eventType: 'mouseover', // string, 切换按钮鼠标事件
            autoPlay: true, // boolean, 开启自动播放
            time: 3e3, // number, 动画播放间隔时间
            callback: function() {} // 当slides加载完成后回调函数
        }, option);

        return $(this).each(function() {
            var elem = $(this),
                cur = option.start - 1,
                container = $('.' + option.container, elem),
                len = container.children().length,
                w = option.width,
                h = option.height,
                direction = option.direction,
                effect = option.effect,
                eventType = option.eventType,
                active = false,
                loaded = false,
                ctrlAct = false,
                prevAct = false,
                tmpArr = [],
                t = null,
                curIdx = 0;

            if (len < 2) { //小于2个图片时不显示左右切换按钮及焦点
                container.children().fadeIn(option.fadeSpeed, option.fadeEasing, function() {
                    loaded = true;
                    option.callback();
                });
                $('.' + option.nextBtn + ', .' + option.prevBtn, elem).hide();
                $('.' + option.control, elem).hide();
                return false;
            }

            function isTransition() { //判断是否支持transition
                var thisBody = document.body || document.documentElement,
                    thisStyle = thisBody.style,
                    support = (thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined) && (navigator.userAgent.toLowerCase().match(/applewebkit\/([\d.]+)/) ? navigator.userAgent.toLowerCase().match(/applewebkit\/([\d.]+)/)[1].split('.')[1] !== '1' : '');
                return support;
            };

            if (!option.cusControl) { //渲染焦点
                for (var i = 1; i < len + 1; i += 1) {
                    tmpArr.push('<li><a href="#nogo" hideFocus>' + (i) + '</a></li>');
                }
                $('<ul class=' + option.control + ' />').html(tmpArr.join('')).appendTo(elem);
            }

            //初始化焦点
            $("." + option.control, elem).children().eq(cur).addClass(option.current);

            //增加prdloadimage图片并且预显示第几个图
            if (option.preload && $('img', container).eq(cur).length) {
                container.css({
                    background: 'url(' + option.preloadImage + ') no-repeat 50% 50%'
                });
                var img = $('img', container).eq(cur).attr('src');
                $('img', container).eq(cur).attr('src', img).load(function() {
                    container.children().eq(cur).fadeIn(option.fadeSpeed, option.fadeEasing, function() {
                        container.removeAttr('style');
                        loaded = true;
                        option.callback();
                    });
                });
            } else {
                container.children().eq(cur).fadeIn(option.fadeSpeed, option.fadeEasing, function() {
                    loaded = true;
                    option.callback();
                });
            }

            //slide动画方式
            function slideAnimate(directions, directionVal) {

                var cssDirection = {
                    'left': {
                        left: directionVal
                    },
                    'top': {
                        top: directionVal
                    }
                };

                function removeStyle() {
                    active = false;
                    ctrlAct = false;
                    prevAct = false;
                    container.removeAttr('style');
                    container.children().removeAttr("style").eq(cur).show();
                    option.callback();
                };

                function removeCss3Style() {
                    active = false;
                    ctrlAct = false;
                    prevAct = false;
                    container.css(animateCss3DirectionEnd[directions]).children().removeAttr("style").eq(cur).show();
                    option.callback();
                };

                container.children().eq(cur).css(cssDirection[directions]).show();

                if (isTransition()) {
                    var animateCss3 = {
                            'transition': option.slideSpeed + 'ms'
                        },
                        animateCss3Direction = {
                            'left': {
                                'transform': 'translate3d(' + (-directionVal) + 'px, 0 ,0)'
                            },
                            'top': {
                                'transform': 'translate3d(0, ' + (-directionVal) + 'px, 0)'
                            }
                        },
                        animateCss3End = {
                            'transition': 'none'
                        },
                        animateCss3DirectionEnd = {
                            'left': {
                                'transform': 'translate3d(0, 0, 0)'
                            },
                            'top': {
                                'transform': 'translate3d(0, 0, 0)'
                            }
                        };

                    $.extend(true, animateCss3Direction[directions], animateCss3);
                    $.extend(true, animateCss3DirectionEnd[directions], animateCss3End);

                    container.css(animateCss3Direction[directions]).on('transitionend', removeCss3Style);
                } else {
                    var animateDirection = {
                        'left': {
                            'margin-left': -directionVal
                        },
                        'top': {
                            'margin-top': -directionVal
                        }
                    };
                    container.animate(animateDirection[directions], option.slideSpeed, option.slideEasing, removeStyle);
                }
            };

            //fade动画方式
            function fadeAnimate() {
                if (isTransition()) {
                    container.children().eq(cur).css({
                        'opacity': 0
                    }).show().css({
                        'opacity': 1,
                        'transition': 'opacity ' + option.fadeSpeed + 'ms ease'
                    }).on('transitionend', function() {
                        active = false;
                        ctrlAct = false;
                        prevAct = false;
                        $(this).removeAttr('style').show();
                        option.callback();
                    }).siblings().css({
                        'opacity': 0,
                        'transition': 'opacity ' + option.fadeSpeed + 'ms ease'
                    }).on('transitionend', function() {
                        container.children().eq(cur).siblings().removeAttr("style");
                        option.callback();
                    });
                } else {
                    container.children().eq(cur).fadeIn(option.fadeSpeed, option.fadeEasing, function() {
                        option.callback();
                        active = false;
                        ctrlAct = false;
                        prevAct = false;
                    }).siblings().fadeOut(option.fadeSpeed, option.fadeEasing, function() {
                        $(this).removeAttr("style");
                        option.callback();
                    });
                }
            };

            //动画逻辑处理
            function animate(direction, effect) {
                if (!active && loaded) {
                    active = true;

                    //上一个时，重置下cur值
                    if (prevAct) {
                        cur -= 2;
                    }

                    //焦点控制时重置下cur值
                    if (ctrlAct) {
                        cur = curIdx - 1;
                    }

                    cur = (cur + 1) % len;

                    $('.' + option.control, elem).children().removeClass(option.current).eq(cur).addClass(option.current);

                    if (effect == 'fade') {
                        fadeAnimate();
                    } else {
                        var oDirection = {
                            'next': function() {
                                slideAnimate('left', w);
                            },
                            'prev': function() {
                                slideAnimate('left', -w);
                            },
                            'top': function() {
                                slideAnimate('top', h);
                            },
                            'bottom': function() {
                                slideAnimate('top', -h);
                            }
                        };
                        oDirection[direction]();
                    }
                }
            };

            //焦点控制显示
            $('.' + option.control, elem).children().each(function(idx, item) {
                $(this).on(eventType, function() {
                    var thisCurIdx = $('.' + option.control + ' .' + option.current, elem).index();
                    curIdx = idx;
                    ctrlAct = true;
                    if (idx == thisCurIdx) {
                        return;
                    }
                    if (effect === 'fade') {
                        animate(direction, effect);
                    } else if (direction == 'top') {
                        if (idx < thisCurIdx) {
                            animate('bottom', effect);
                        } else {
                            animate('top', effect);
                        }
                    } else {
                        if (idx < thisCurIdx) {
                            animate('prev', effect);
                        } else {
                            animate('next', effect);
                        }
                    }

                    $(this).blur();
                });
            });

            function nextIframe() { //下一帧
                animate(direction, effect);
            };

            function prevIframe() { //上一帧
                prevAct = true;
                (effect == 'fade' && animate(direction, effect)) || (direction == 'top' && animate('bottom', effect) || animate('prev', effect));
            }

            if ('ontouchend' in document) {
                var target = $('img', elem),
                    targetEle = new Swipe(target);
                if ((direction == 'next' || effect == 'fade')) {

                    targetEle.on('swipeleft', nextIframe).on('swiperight', prevIframe);
                } else if ((direction == 'top')) {
                    targetEle.on('swipeup', nextIframe).on('swipedown', prevIframe);
                }
            }

            //下一帧
            $('.' + option.nextBtn, elem).on('click', function() {
                nextIframe();
                $(this).blur();
                return false;
            });

            //上一帧
            $('.' + option.prevBtn, elem).on('click', function() {
                prevIframe();
                $(this).blur();
                return false;
            });

            //自动播放
            if (option.autoPlay) {
                elem.on('mouseenter', function() {
                    clearInterval(t);
                }).on('mouseleave', function(event) {
                    t = setInterval(function() {
                        animate(direction, effect)
                    }, option.time);
                }).trigger('mouseleave');
            }
        });
    };
}));