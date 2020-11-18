import axios from 'axios';
import {
    Message,
    Loading,
} from 'element-ui';
import {
    getUserToken,
    getRefreshToken,
    saveUserToken,
    saveRefreshToken,
    delUserToken,
} from '@/cache';
import store from '@/store';
let hasChangeState = false;

var globals = window;

var stores = store

const service = axios.create({
    // 设置超时时间
    timeout: 15000,
    baseURL: process.env.VUE_APP_BASE_URL || '/',
});
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 * 请求前拦截
 * 用于处理需要在请求前的操作
 */
// 用来处理刷新token后重新请求的自定义变量
// axios.defaults.isRetryRequest = false;

function getReToken() {
    // refresh_token使用vuex存在本地的localstorage
    // qs的使用主要是因为该接口需要表单提交的方式传数据
    return axios.post('/api_v2/account/refreshToken', {
        refreshToken: getRefreshToken(),
    });
}
let loading = null;
let timer = null;
let prom = null; // 一个Promise对象，用作yield的返回值
let promdone = true;
service.interceptors.request.use(config => {
    // 根据需求需要是否更改api
    // if (typeof config.url == 'string') {
    //     var urlArr = config.url.split('/');
    //     var baseApi = '/api'; // 设置api
    //     for (let i = 2; i < urlArr.length; i++) {
    //         baseApi += '/' + urlArr[i];
    //     }
    //     config.url = baseApi;
    // }
    // 在请求先展示加载框
    loading = Loading.service({
        text: '正在加载中......',
        background: 'rgba(0,0,0,0.2)',
    });
    const token = getUserToken();
    token && (config.headers['Authorization'] = 'Bearer ' + token); // 后台接口定义传入的token前加Beare加空格
    if (config.data) {
        String(config.method).toLocaleUpperCase() === 'GET' && (config.params = config.data);
        if (config.data.buttonId) {
            var buttonId = config.data.buttonId;
            buttonId && (config.headers['buttonId'] = buttonId);
        } else if (Object.prototype.toString.call(config.data) === '[object FormData]') {
            let btnId = config.data.get('buttonId');
            btnId && (config.headers['buttonId'] = btnId);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(response => {
    // 请求响应后关闭加载框
    loading && loading.close();
    let hostName = location.host;
    const responseCode = response.status;
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (responseCode === 200) {
        var routeName = globals.routeName;
        if (stores.state.jurisdictionStatus[routeName]) {
            store.dispatch('setJurisdiction', {
                [routeName]: false
            });
        }
        return Promise.resolve(response.data);
    } else if (responseCode === 222) {
        delUserToken();
        window.location.href = "http://" + hostName + '/#/login';
    }
    return Promise.reject(response);
}, error => {
    console.log(error);
    // 请求响应后关闭加载框
    let config = error.config;
    if (loading) {
        loading.close();
    }
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    // 断网 或者 请求超时 状态
    if (!error.response) {
        // 请求超时状态
        if (error.message.includes('timeout')) {
            // console.log('超时了');
            Message.error('请求超时，请检查网络是否连接正常');
        } else {
            // 可以展示断网组件
            Message.error('请求失败，请检查网络是否已连接');
        }
        return;
    }
    // 服务器返回不是 200 的情况，会进入这个回调
    // 可以根据后端返回的状态码进行不同的操作
    const responseCode = error.response.status;
    switch (responseCode) {
        // 401：未登录
        case 401:
            config.data && (config.data = JSON.parse(config.data));
            var hostName = location.host;
            if (!promdone) {
                return prom.then(() => {
                    return service(config);
                });
            }
            try {
                let oldToken = error.response.config.headers['Authorization'].replace('Bearer ', '');
                let nowToken = getUserToken();
                // 当现在的Token 和 发出请求的 Token 不同时，表明已有刷新refreshToken请求过了，需重新发起请求；
                // 用来处理某些请求响应慢导致的问题。
                if (oldToken !== nowToken) {
                    return service(error.response.config);
                }
            } catch (e) {
                window.location.href = 'http://' + hostName + '/#/login';
            }
            promdone = false;
            return prom = new Promise((resolve) => {
                if (!config.isRetryRequest && getRefreshToken()) {
                    return getReToken()
                        .then(function (res) {
                            let data = res.data;
                            saveUserToken(data.data.accessToken);
                            saveRefreshToken(data.data.refreshToken);
                            // 修改flag
                            config.isRetryRequest = true;
                            promdone = true;
                            resolve("success");

                        })
                        .catch(function () {
                            // 刷新token接口错误后，保证请求能重置。
                            console.log("重置请求变量....");
                            promdone = true;
                            // 刷新token失败只能跳转到登录页重新登录
                            // store.dispatch('UserLogout');
                            window.location.href = "http://" + hostName + '/#/login';
                            throw error;
                        });
                }
                window.location.href = "http://" + hostName + '/#/login';
            }).then(() => {
                return service(config);
            });
        case 404:
            Message({
                showClose: true,
                message: '网络请求不存在',
                type: 'error'
            });
            break;
        // 404请求不存在
        case 400:
            Message({
                showClose: true,
                message: error.response.data,
                type: 'error'
            });
            break;
        // 接口发布错误
        case 502:
            Message({
                showClose: true,
                message: '系统正在升级，请稍后重试',
                type: 'error'
            });
            break;
        // 其他错误，直接抛出错误提示
        case 222: // 退出
            delUserToken();
            window.location.href = "http://" + location.host + '/#/login';
            break;
        case 403:
            if (!hasChangeState) {
                hasChangeState = true;
                // var routeName = globals.routeName;
                if (globals.routeName) {
                    var routeName = globals.routeName.toLowerCase();
                    console.log(routeName);

                    hasChangeState = false;
                } else {
                    hasChangeState = false;
                    return
                }
                if (stores.state.jurisdictionStatus[routeName]) return;
                store.dispatch('setJurisdiction', {
                    [routeName]: true
                }).then(() => {
                    hasChangeState = false;
                });
                console.log(routeName);
            }
            break;
        default:
            Message({
                message: error.response.data,
                type: 'error'
            });
    }
    return Promise.reject(error);
});

export default service;