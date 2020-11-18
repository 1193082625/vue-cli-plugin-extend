/*
 * @Descripttion: 
 * @Author: 王月
 * @Date: 2020-10-28 10:59:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-18 16:30:11
 */
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
if(!IsPC()) {
    const baseSize = 32;
    let setRem = () => {
        const scale = document.documentElement.clientWidth / 750;
        document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px';
    }
    setRem();
    window.onresize = function () {
        setRem();
    }
}