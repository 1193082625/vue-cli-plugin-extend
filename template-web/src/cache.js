/*
 * @Descripttion: 本地缓存
 * @Author: 王月
 * @Date: 2020-09-16 13:43:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-20 14:53:41
 */
// 开源storage的库，对localstorage和sessionstorage的封装
import storage from 'good-storage';

const TOKEN = '_loginToken_'; // 登录token
const FRESH_TOKEN = '_refreshToken_'; // 登录token

// 存储用户token
export function saveToken(token) {
    storage.set(TOKEN, token);
}
// 获取token
export function getToken() {
    return storage.get(TOKEN);
}
// 删除token
export function delToken() {
    storage.set(TOKEN, '');
}
// 存储刷新token
export function saveRefreshToken(token) {
    storage.set(FRESH_TOKEN, token);
}
// 获取刷新token
export function getRefreshToken() {
    return storage.get(FRESH_TOKEN)||'';
}