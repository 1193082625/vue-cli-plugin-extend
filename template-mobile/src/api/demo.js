/*
 * @Descripttion: 接口调用demo
 * @Author: 王月
 * @Date: 2020-09-16 13:46:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-18 15:32:13
 */
import service from './api';

// 获取AppId
export function GetWXAppId(data) {
    return service({
        url: `${baseApi}/Activity/GetWXAppId`,
        method: 'GET',
        data
    });
}
// 服务器当前时间
export function GetServerTime(data) {
    return service({
        url: `${baseApi}/activity/GetServerTime`,
        method: 'GET',
        data
    });
}
// 获取短网址
export function ShortUrl(data) {
    return service({
        url: `${baseApi}/activity/ShortUrl`,
        method: 'GET',
        data
    });
}
// 获取jssdk
export function GetJSSDK(data) {
    return service({
        url: `${baseApi}/Activity/GetJSSDK`,
        method: 'GET',
        data
    });
}