import axios from 'axios';
import store from '@/store';
import {
    Message,
    Loading
} from 'element-ui';
import {
  getToken,
  getRefreshToken,
  saveToken,
  saveRefreshToken,
  saveTokenExpire,
  delToken,
  deleteRefreshToken,
  delUUID,
  delTokenExpire,
  delLoginInfo,
  delLoginUserId,
  getTokenExpire
} from '@/cache';
let loading = null; // 判断加载中的状态
let prom = null; // 一个Promise对象，用作yield的返回值
let isRefresh = false; // 用于判断刷新token接口调用是否结束
const hostName = location.host; // 获取当前地址域名
const CancelToken = axios.CancelToken; // 给接口添加取消
let cancelArr = []; // 存储被取消的接口，等待刷新token后重新请求
let pending = []; // 当前正在请求中的接口，用于去重
let newToken = null; // 最新的token
const service = axios.create({
    // 设置超时时间
    timeout: 15000,
    baseURL: process.env.VUE_APP_BASE_URL || '/'
});
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 请求前拦截
service.interceptors.request.use(
    config => {
        const pendingIdx = pending.findIndex(ele => ele.url === config.url && ele.method === config.method);
        if(pendingIdx > -1) {
            return Promise.reject('接口请求重复');
        };
        pending.push(config);
        // 如果请求中没有取消，则添加
        if(!config.cancelToken) {
            config.cancelToken = new CancelToken(function executor(c) { // 设置 cancel token
                config.cancel = c;
            });
        }
        // 在请求先展示加载框，uploadVideo/appvideo接口除外
        if (config.url.indexOf('uploadVideo/appvideo') === -1) {
            loading = Loading.service({
                text: '正在加载中......',
                background: 'rgba(0,0,0,0.2)'
            });
        }
        // 配置post和get对应的传参
        if (config.data) {
            String(config.method).toLocaleUpperCase() === 'GET' && (config.params = config.data);
        }
        const token = getToken();
        const isLogin = config.url.indexOf('/javaapi/appmember/assistantLogin') > -1;
        if (token && !isLogin) {
            config.headers['Authorization'] = 'Bearer ' + token; // 后台接口定义传入的token前加Beare加空格
        }
        // 如果正在调用刷新token接口，则后续接口请求
        let p = new Promise((resolve) => {
            // 判断token是否即将过期，排除登录接口
            if (token && tokenExpire() && !isLogin) {
                console.log('token即将过期');
                if (isRefresh) {
                    console.log('正在等待刷新token');
                    let idx = cancelArr.findIndex(ele => ele.url === config.url && ele.method === config.method);
                    idx === -1 && cancelArr.push(config);
                    config.cancel('终止请求');
                    resolve(prom);
                    return;
                }
                isRefresh = true;
                prom = new Promise((resolve) => {
                    getReToken().then(res => {
                        isRefresh = false;
                        let data = res.data;
                        config.headers['Authorization'] = 'Bearer ' + data.access_token;
                        newToken = data.access_token;
                        saveToken(data.access_token);
                        saveRefreshToken(data.refresh_token);
                        saveTokenExpire(data.expires_in * 1000 + (new Date()).getTime());
                        let userInfo = {
                            headImg: data.headImage,
                            nickName: data.nickName,
                            userName: data.userName,
                            userId: data.userId,
                            coach: data.coach
                        };
                        store.dispatch('setUser', JSON.stringify(userInfo));
                        resolve('success');
                    }).catch(err => {
                        console.log('刷新token接口出错了');
                        console.log(err);
                        // 请求响应后关闭加载框
                        delToken();
                        deleteRefreshToken();
                        delUUID();
                        delTokenExpire();
                        delLoginInfo();
                        delLoginUserId();
                        loading && loading.close();
                        window.location.href = 'http://' + hostName + '/#/login';
                    });
                }).then(() => {
                    console.log('重新请求失败的接口', config);
                    removePending(config);
                    return service(config);
                });
                return prom;
            }
            resolve('success');
        }).then(() => {
            return config;
        });
        return p;
    },
    error => {
        return Promise.reject(error);
    }
);
// 请求响应拦截
service.interceptors.response.use(
  response => {
    // 请求响应后关闭加载框
    loading && loading.close();
    let code = response.data.code;
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (code === 200) {
        // 如果有被取消的接口，则重新请求
        if(cancelArr.length) {
            cancelArr.forEach(ele => {
                let newConfig = ele;
                newConfig.cancelToken = null;
                newConfig.cancel = null;
                newConfig.headers.Authorization = 'Bearer ' + newToken;
                return service(newConfig).then(res => res).catch(err => {
                    loading && loading.close();
                    return err;
                })
            });
            cancelArr = [];
        }
        removePending(response.config);
        return Promise.resolve(response.data);
    }
    // 否则的话抛出错误
    switch (code) {
        case 400:
            Message({
                showClose: true,
                message: response.data,
                type: 'error'
                });
            break;
        case 404:
            Message({
                showClose: true,
                message: '网络请求不存在',
                type: 'error'
                });
            break;
        default:
            Message({
                message: response.data.msg,
                type: 'error'
            });
    }
    return Promise.resolve(response.data);
  },
  error => {
    // 请求响应后关闭加载框
    loading && loading.close();
    if(error.message === '终止请求' || error === '接口请求重复') {
        return Promise.reject(error);
    } else if (!error.response) {
    // 断网 或者 请求超时 状态
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
    return Promise.reject(error);
  }
);
function removePending(config) {
    let hasEndIdx = pending.findIndex(ele => ele.url === config.url && ele.method === config.method);
    hasEndIdx > -1 && pending.splice(hasEndIdx, 1);
}
// 获取refreshTokenS
function getReToken() {
    let refreshToken = getRefreshToken();
  // refresh_token使用vuex存在本地的localstorage
  // qs的使用主要是因为该接口需要表单提交的方式传数据
  return axios.get(`/javaapi/appmember/refreshToken/${refreshToken}`, {
    refreshToken: refreshToken
  });
}
// 判断是否快过期
function tokenExpire() {
    let tokenExpire = getTokenExpire();
    let nowTime = new Date().getTime();
    return tokenExpire - nowTime < 1000 * 300;
}
export default service;
