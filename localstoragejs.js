(function() {
    'use strict';

    var lastver = [],
        jsversion = jsconfig.version,
        nameRegx = new RegExp('^' + jsconfig.prefix + '.*$'),
        idx = 0,
        storage = window.localStorage;

    //简单ajax封装
    function ajax(opt) {
        var data = JSON.stringify(opt.data),
            url = opt.url,
            type = (opt.type ? opt.type : 'GET').toUpperCase(),
            callback = opt.callback || function() {},
            failback = opt.failback || function() {},
            Ajax = new XMLHttpRequest();

        if (url == null || url == undefined) {
            return;
        }

        Ajax.onreadystatechange = function() {
            if (Ajax.readyState == 4) {
                if (Ajax.status == 200) {
                    var res = Ajax.responseText;
                    callback(res);
                }
            } else {
                failback(Ajax.status, Ajax.responseText);
            }
        };

        Ajax.open(type, url);

        if (type == 'POST') {
            Ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        Ajax.send(data);

        function abort() {
            Ajax.abort();
        }

        return {
            abort: abort
        };
    };

    // eval方法
    function globalEval(str) {
        try {
            var script = document.createElement('script');
            script.appendChild(document.createTextNode(str));
            document.body.appendChild(script);
        } catch (e) {
            console.log(e);
        }
    };

    for (var jspath in jsversion) {
        lastver.push(jspath + '?v=' + jsversion[jspath]);
    }

    //更新本地储存
    function updatals(str) {
        var key, lastname, lastverNb, lsname, lsverNb;

        lastname = str.slice(0, str.lastIndexOf('?'));
        lastverNb = str.slice(str.lastIndexOf('=') + 1);

        for (key in storage) {
            if (nameRegx.test(key)) {
                lsname = key.slice(key.indexOf('-') + 1, key.lastIndexOf('?'));
                lsverNb = key.slice(key.lastIndexOf('=') + 1);

                if ((lsname == lastname && lsverNb != lastverNb) || !jsversion.hasOwnProperty(lsname)) {
                    storage.removeItem(key);
                }
            }
        }
    }

    //设置本地缓存
    function setLocalStorage() {
        var firstItem = lastver.shift();

        if (!!firstItem && storage.hasOwnProperty(jsconfig.prefix + firstItem)) {
            updatals(firstItem);
            globalEval(storage.getItem(jsconfig.prefix + firstItem));
            setLocalStorage();
        } else {
            ajax({
                url: firstItem,
                callback: function(res) {
                    try {
                        globalEval(res);
                        updatals(firstItem);
                        storage.setItem(jsconfig.prefix + firstItem, res);
                        setLocalStorage();
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
            
        }
    }

    //初始化
    function init() {

        setLocalStorage();
    };

    init();

})();