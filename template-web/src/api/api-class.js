/*
 * @Author: echo
 * @Date: 2021-02-20 15:22:43
 * @LastEditTime: 2021-03-18 17:26:43
 * @LastEditors: Please set LastEditors
 * @Description: axios的请求封装
 * @FilePath: \jiake-share-h5\src\api\api.ts
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import store from '@/store';
import * as Types from '@/store/action-types';
import { Notify } from 'vant';

class JKRequest {
    #baseURL;
    #timeout;
    constructor() {
        this.#baseURL = process.env.DEV_BASE_URL;
        this.#timeout = 30 * 1000;
    }
    request(options) {
        // 针对每次请求创建新的实例，每个实例的拦截器和其他请求无关，这样方便给每次请求单独配置拦截器
        const instance = axios.create();
        this.setInterceptors(instance);
        const opts = this.#mergeOptions(options);
        return instance(opts);
    }
    // 添加拦截
    setInterceptors(instance) {
        instance.interceptors.request.use((config) => {
            // 显示加载状态
            store.commit(Types.SET_LOADING, true);
            if (config.data && String(config.method).toLocaleUpperCase() === "GET") {
                config.params = config.data;
            }
            return config;
        });
        instance.interceptors.response.use((res) => {
            // 关闭加载状态
            store.commit(Types.SET_LOADING, false);
            // java解析状态值
            const code = res.data.code;
            if(res.status === 200 && !code)  return Promise.resolve(res.data);
            return this.#analysisStatus(code, res.data);
        }, err => {
            return this.#analysisStatus(err.response.status, err.response.data);
        });
    }
    // 解析接口返回状态值
    #analysisStatus(status, data){
        switch(status) {
            case 200:
                return Promise.resolve(data);
            case 400:
                Notify({ type: "danger", message: data.msg || data });
                break;
            case 404:
                Notify({ type: "danger", message: "网络请求不存在" });
                break;
            default:
                Notify({ type: "danger", message: data.msg || data });
                break;
        }
        return Promise.reject(data);
    }
    // 合并options
    #mergeOptions(options = {}) {
        return {
            baseURL: this.#baseURL,
            timeout: this.#timeout,
            ...options
        };
    }
    get(url, params = {}, headers = {}) {
      return this.request({
        method: 'get',
        url,
        params,
        headers,
      });
    }
    post(url, data = {}, headers = {}) {
      return this.request({
        method: 'post',
        url,
        data,
        headers
      });
    }
}

export default JKRequest;
