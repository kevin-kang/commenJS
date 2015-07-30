(function() {
    'use strict';

    var oldver = {},
        lsver = [],
        storage = window.localStorage,
        lspattern = new RegExp(lastmark + '_(.+)');

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

    lsver = lsver.reverse();
    
    function removels(){ //移除本地储存
        lsver.forEach(function(v,k){
            
            var jspattern = new RegExp(lastmark + '_(.+\?$)'),
                lsverpattern = /\?ver=(.+)/,
                lsv = v.match(lsverpattern) ? v.match(lsverpattern)[1].replace(/\./g, '') : 0;
            // console.log(v, jspattern)
            if(jspattern.test(v)){
                
               var lastv = lastver[k];
               if(!!lastv){
                    lastv = lastv.match(lsverpattern)[1].replace(/\./g, '');
               }
               console.log(lsv != lastv)
               if(lsv != lastv){
                   storage.removeItem(v);
               }
               // console.log(lastv)
                // storage.removeItem(v);
            }
        });
    }
    
    function setLocalStorage() { //更新或者加载本地储存
        var firstItem = lastver.shift(),
            tmpmark = !!firstItem ? (firstItem.lastIndexOf('?') == -1 ? '' : lastmark + '_') : '',
            ver = tmpmark + (!!firstItem ? firstItem.slice(firstItem.lastIndexOf('/') + 1) : '');
        // console.log(ver)
        if (!firstItem || !!oldver[ver]) {
            if(firstItem){
                globalEval(storage.getItem(ver));
                setLocalStorage();
            }
            return;
        }
        removels();
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