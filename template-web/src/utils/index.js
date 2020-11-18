/*
 * @Descripttion: 项目工具方法
 * @Author: 王月
 * @Date: 2020-09-16 13:49:09
 * @LastEditors: 王月
 * @LastEditTime: 2020-09-17 09:43:49
 */

// 防抖
export function _debounce(fn, delay) {
    delay = delay || 200;
    var timer;
    return function () {
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn && fn.apply(this, args);
        }, delay);
    };
}
// 节流
export function _throttle(fn, interval) {
    var last;
    var timer;
    interval = interval || 200;
    return function () {
        var th = this;
        var args = arguments;
        var now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn && fn.apply(th, args);
            }, interval);
        } else {
            last = now;
            fn && fn.apply(th, args);
        }
    };
}
// 解析location.search为对象
export function searchObj(search) {
    return JSON.parse("{\"".concat(decodeURIComponent(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"'), "\"}"));
}

export function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE || isEdge || isIE11) {
        return true; //IE11  
    }
    return false; //不是ie浏览器
}
//file参数 是文件信息
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
            imgResult = reader.result;
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.onloadend = function() {
            resolve(imgResult);
        };
    });
}
