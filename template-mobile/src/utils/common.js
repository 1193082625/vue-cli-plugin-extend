import Vue from 'vue';
import { Toast } from 'vant';
import wx from 'weixin-js-sdk';
import { GetJSSDK, GetServerTime } from '@/api/';
import { saveAppId } from "@/cache/";

Vue.use(Toast);

const utilJs = {
    _throttle(fn, interval) {
        var last;
        var timer;
        interval = interval || 200;
        return function (params) {
            var args = arguments;
            var now = +new Date();
            if (last && now - last < interval) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    last = now;
                    fn.apply(this, args);
                }, interval);
            } else {
                last = now;
                fn.apply(this, args);
            }
        };
    },
    isPhoneNumber: (phoneStr) => {
        const mobile = /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/;
        return mobile.test(phoneStr);
    },
    disSubButton(id) {
        const btn = document.getElementById(id);
        btn.setAttribute('disabled', 'disabled');
        btn.style.backgroundColor = '#d0d0d0';
    },
    ableSubButton(id) {
        const btn = document.getElementById(id);
        btn.removeAttribute('disabled');
        btn.style.backgroundColor = '#fe3b5c';
    },
    isMobileUserAgent: () => (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase())),
    // 回到顶部
    toPageScrollTop: () => {
        const a = document;
        a.body.scrollTop = 0;
        a.documentElement.scrollTop = 0;
    },
    isPassword: (str) => {
        const result = str.match(/\d{6}/);
        if (result === null) return false;
        return true;
    },
    isBankCardNo: (str) => {
        const result = str.match(/\d{16}|\d{17}|\d{18}|\d{19}|\d{20}|\d{21}/);
        if (result === null) return false;
        return true;
    },
    isWeiXin: () => {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i).toString().trim() == 'micromessenger') {
            return true;
        }
        return false;
    },
    wxShare(obj) {
        let {shareUrl, title, shareImg, shareDesc, callback} = obj;
        if (shareImg == null || shareImg == '' || shareImg.length == 0 || shareImg == undefined) {
            shareImg = window.location.protocol + '//' + window.location.hostname + '/img/share-default.45d79ba7.png';
        }
        if (this.isWeiXin()) {
            this.initConfig();
            wx.ready(() => {
                // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                wx.updateAppMessageShareData({ 
                    title, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareImg, // 分享图标
                    success: function () {
                      // 设置成功
                    }
                });
                // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                wx.updateTimelineShareData({ 
                    title: `我想要${title}，快来帮我助力一下吧！`, // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareImg, // 分享图标
                    success: function () {
                      // 设置成功
                    }
                })
                
                wx.onMenuShareAppMessage({
                    debug: false,
                    title, // 分享标题
                    desc: shareDesc,
                    link: shareUrl,
                    imgUrl: shareImg,
                    success() {
                        // 用户确认分享后执行的回调函数
                        callback && callback();
                    },
                    cancel(err) {
                        // 用户取消分享后执行的回调函数
                        console.log(err);
                    },
                });

                wx.onMenuShareTimeline({
                    title: `我想要${title}，快来帮我助力一下吧！`, // 分享标题
                    desc: shareDesc,
                    link: shareUrl,
                    imgUrl: shareImg,
                    success() {
                        // 用户确认分享后执行的回调函数
                        callback && callback();
                    },
                    cancel() {
                        console.log(err);
                        // 用户取消分享后执行的回调函数
                    },
                });
                wx.error(function (res) {
                    console.log(res)
                });
            });
        } else {
            console.log('不是微信');
        }
    },
    // 判断某个时间距离现在的毫秒数
    async millisecond(time) {
        var res = await GetServerTime()
        let fromatNowDate = res.data.nowTime.split('-').join('/');
        var fromatEndDate = time.split('-').join('/')
        var formatDate = new Date(fromatEndDate).getTime() - new Date(fromatNowDate).getTime();
        return formatDate;
    },
    hideMenus() {
        if (this.isWeiXin()) {
            this.initConfig();
            wx.ready(() => {
                wx.hideMenuItems({
                    menuList: [
                        "menuItem:share:appMessage",
                        "menuItem:share:timeline",
                        "menuItem:share:qq",
                        "menuItem:share:weiboApp",
                        "menuItem:share:facebook",
                        "menuItem:share:QZone"
                    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        }
    },
    showMenus() {
        if (this.isWeiXin()) {
            this.initConfig();
            wx.ready(() => {
                wx.showMenuItems({
                    menuList: [
                        "menuItem:share:appMessage",
                        "menuItem:share:timeline"
                    ], // 要显示的菜单项，所有menu项见附录3
                    success:() => {
                    },
                    fail:function (res) {
                        console.log(res);
                    }
                });
            });
        }
    },
    hideOptionMenu() {
        if (this.isWeiXin()) {
            this.initConfig();
            wx.ready(() => {
                wx.hideOptionMenu();
            })
        }
    },
    showOptionMenu() {
        if (this.isWeiXin()) {
            this.initConfig();
            wx.ready(() => {
                wx.showOptionMenu();
            });
        }
    },
    initConfig: async () => {
        const jsApiList = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            // 'onMenuShareQQ',
            // 'onMenuShareWeibo',
            // 'onMenuShareQZone',
            'chooseWXPay',
            'hideMenuItems',
            'showMenuItems'
        ];
        let res = await GetJSSDK({
            url: encodeURIComponent(window.location.href.split('#')[0])
        })
        let data = res.data.jssdkUiPackage;
        saveAppId(data.appId);
        wx.config({
            debug: false,
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: parseInt(data.timestamp), // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: jsApiList // 必填，需要使用的JS接口
        });
        wx.error(function (res) {
            console.log('出错了');
            console.log(res)
        });
    },
    checkJsApi: () => {
        wx.checkJsApi({
            jsApiList: ['startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
            ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success() { },
        });
    },
    // 选择图片
    chooseImage: data => new Promise(((resolve) => {
        const sorceData = {
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        };
        Object.assign(sorceData, data);
        wx.chooseImage({
            count: sorceData.count, // 默认9
            sizeType: sorceData.sizeType, // 可以指定是原图还是压缩图，默认二者都有
            sourceType: sorceData.sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                resolve(localIds);
            },
        });
    })),
    // 预览图片
    previewImage: (data) => {
        wx.previewImage({
            current: data.current, // 当前显示图片的http链接
            urls: data.urls, // 需要预览的图片http链接列表
        });
    },
    // 下载图片
    uploadImage: data => new Promise(((resolve) => {
        wx.downloadImage({
            localId: data.serverId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success(res) {
                const localId = res.localId; // 返回图片下载后的本地ID
                resolve(localId);
            },
        });
    })),
    // 监听语音播放完毕
    onVoicePlayEnd: (callBack) => {
        wx.ready(() => {
            wx.onVoicePlayEnd({
                success(res) {
                    console.log(`onVoicePlayEndwxcallBack.onVoicePlayEnd :ID=${res.localId}`);
                    const localId = res.localId; // 返回音频的本地ID
                    callBack(localId);
                },
            });
        });
    },
    // 微信支付
    chooseWXPay: data => new Promise(((resolve, reject) => {
        if (utilJs.isWeiXin()) {
            utilJs.initConfig();
            wx.ready(() => {
                wx.chooseWXPay({
                    debug: false,
                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success(res) {
                        // 支付成功后的回调函数
                        resolve(res);
                    },
                    fail(err) {
                        // 支付成功后的回调函数
                        reject(err);
                    },
                });
            });
            wx.error(function (res) {
                reject(res);
            });
        }
    })),
    // 匹配替换url的值
    changeURLArg(url,arg,arg_val){ 
        var pattern=arg+'=([^&]*)'; 
        var replaceText=arg+'='+arg_val; 
        if(url.match(pattern)){ 
            var tmp='/('+ arg+'=)([^&]*)/gi'; 
            tmp=url.replace(eval(tmp),replaceText); 
            return tmp; 
        }else{ 
            if(url.match('[\?]')){ 
                return url+'&'+replaceText; 
            }else{ 
                return url+'?'+replaceText; 
            } 
        } 
    } 
};

// 判断访问终端
const browser = {
    versions: (function () {
        let u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) === ' qq', // 是否QQ
        };
    }()),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};

export {
    browser,
    utilJs
};
