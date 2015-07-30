(function() {
    'use strict';

    var oldver = {},
        clastver = lastver.slice(),
        nameRegx = new RegExp('^' + lastmark + '_.*$|^zepto*'),
        idx = 0,
        storage = window.localStorage;

    function ajax(opt) { //简单ajax封装
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

    function globalEval(str) { // eval方法
        try {
            eval(str);
        } catch (e) {
            console.log(e);
        }
    };

    function removels() { //移除本地储存
        var lsname, lastname, lsverNb, lastverNb, key, issuperfluous = 0;

        lastname = lastver[idx];
        lastname = lastname.slice(lastname.lastIndexOf('/') + 1);
        lastverNb = lastname.slice(lastname.lastIndexOf('=') + 1).replace(/\./g, '');
        lastname = lastname.slice(0, lastname.lastIndexOf('.js'));

        for (key in storage) {
            if (nameRegx.test(key)) {

                lsname = key.slice(key.indexOf('_') + 1, key.lastIndexOf('.js'));
                lsverNb = key.slice(key.lastIndexOf('=') + 1).replace(/\.+/g, '');
                // console.log('lsname: ' + lsname, lsverNb);
                if (lsname == lastname && lsverNb != lastverNb) {
                    storage.removeItem(key);
                }
                if (lsname == lastname) {
                    // console.log(key);
                    issuperfluous = 0;
                }
            }
            oldver[key] = storage.getItem(key);
        }
        if (nameRegx.test(storage.key(idx))) {
            console.log(storage.key(idx));
        }
        idx++;

        // console.log(oldver);
    }

    function setLocalStorage() { //更新或者加载本地储存
        var firstItem = clastver.shift(),
            tmpmark = !!firstItem ? (firstItem.lastIndexOf('?') == -1 ? '' : lastmark + '_') : '',
            ver = tmpmark + (!!firstItem ? firstItem.slice(firstItem.lastIndexOf('/') + 1) : '');
        // if (!firstItem || !!oldver[ver]) {
        //     if (firstItem) {
        //         globalEval(storage.getItem(ver));
        //         setLocalStorage();
        //     }
        //     return;
        // }
        ajax({
            url: firstItem,
            callback: function(res) {
                try {
                    globalEval(res);
                    removels();
                    storage.setItem(ver, res);
                } catch (e) {
                    console.log(e);
                }
                setLocalStorage();
            }
        });
    }

    setLocalStorage();

})();