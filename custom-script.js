var customScript = (function(){

    function addLastDeployDateFooter() {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) { 
               if (xmlhttp.status == 200) {
                   var node = document.getElementById("swagger-ui");
                   
                   var newNode = document.createElement('div');
                   newNode.innerHTML = '<br/><div class="swagger-ui"><div class="wrapper"><div id="last-deploy-date"></div></div></div>';
                   node.parentNode.insertBefore(newNode, node.nextSibling);
                   
                   document.getElementById('last-deploy-date').innerHTML = xmlhttp.responseText;
               }
            }
        };

        xmlhttp.open("GET", "last-deployed.txt", true);
        xmlhttp.send();
    }

    addLastDeployDateFooter();

    function encodeBase64Url(str) {
        if (typeof str !== 'string') {
            return null;
        }
        str = encodeBase64(str);
        str = str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        return str;
    };

    function decodeBase64Url(str) {
        if (typeof str !== 'string') {
            return null;
        }
        var mod = str.length % 4;
        if (mod !== 0) {
            str += $d.repeat('=', 4 - mod);
        }
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        str = decodeBase64(str);
        return str;
    };

    function repeat(str, num) {
        return new Array(num + 1).join(str);
    };

    function encodeBase64(str) {
        if (typeof str !== 'string') {
            return null;
        }
        str = (str + '').toString();
        var strReturn = '';
        if (window.btoa) {
            strReturn = window.btoa(unescape(encodeURIComponent(str)));
        } else {
            strReturn = encodeBase64Fallback(str);
        }
        return strReturn;
    };

    function decodeBase64(str) {
        if (typeof str !== 'string') {
            return null;
        }
        str = (str + '').toString();
        var strReturn = '';
        if (window.atob) {
            strReturn = decodeURIComponent(escape(window.atob(str)));
        } else {
            strReturn = decodeBase64Fallback(str);
        }
        return strReturn;
    };

    function encodeBase64Fallback(data) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

        if (!data) {
            return data;
        }

        data = unescape(encodeURIComponent(data));

        do {
            // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    };

    function decodeBase64Fallback(data) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                dec = '',
                tmp_arr = [];

        if (!data) {
            return data;
        }

        data += '';

        do {
            // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);

        dec = tmp_arr.join('');

        return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
    };

    return {
        encodeBase64Url: function(str) {
            return encodeBase64Url(str);
        }
    };

})();