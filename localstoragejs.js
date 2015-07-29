(function() {
    'use strict';

    var oldver = {},
        lsver = [],
        storage = window.localStorage,
        lspattern = new RegExp('^(' + lastmark + '_).*','g');

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

    for (var i = 0, len = storage.length; i < len; i++) {
        if (lspattern.test(storage.key(i)) || /zepto.js+/g.test(storage.key(i))) {
            oldver[storage.key(i)] = storage.getItem(storage.key(i));
            lsver.push(storage.key(i));
        }
    }

    
    function removels(){ //移除本地储存
        lsver.forEach(function(v,k){
            var lastkey = v;
            var pattern = '';
            // console.log(lastkey.slice(lastkey.lastIndexOf('/') + 1).match(/(.+)\?ver/)[]);
            lastkey = !lastkey ? '' : (lastkey.slice(lastkey.lastIndexOf('/') + 1)).slice(0, lastkey.lastIndexOf('?') != -1 ? lastkey.lastIndexOf('?') : lastkey.length);

            if(!!lastkey){
                pattern = new RegExp(lastmark + '_(.+)');
            }
            console.log(pattern, lsver.toString().match(pattern));

            // if(pattern.test(lskey)){
            //     console.log('message');
            // }
            // var lsjsname = v;
            // var lastjsname = !!lastver[k] ? lastver[k].slice(lastver[k].lastIndexOf('/') + 1) : '';
            // console.log(lsjsname);
            // lastjsname = 'yx_' + lastjsname.match(/(.+)\?ver/)[1];
            // lsjsname = !!lsjsname ? lsjsname.match(/(.+)\?ver/)[1] : '';
            // console.log(lastjsname, lsjsname);
            // if(lastjsname == lsjsname){
            //     storage.removeItem(lsjsname);
            // }
        });
    }
    removels();
    function setLocalStorage() { //更新或者加载本地储存
        var firstItem = lastver.shift(),
            tmpmark = !!firstItem ? (firstItem.lastIndexOf('?') == -1 ? '' : lastmark + '_') : '',
            ver = tmpmark + (!!firstItem ? firstItem.slice(firstItem.lastIndexOf('/') + 1) : '');

        if (!firstItem || !!oldver[ver]) {
            if(firstItem){
                globalEval(storage.getItem(ver));
                setLocalStorage();
            }
            return;
        }
        ajax({
            url: firstItem,
            callback: function(res) {
                try {
                    globalEval(res);
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