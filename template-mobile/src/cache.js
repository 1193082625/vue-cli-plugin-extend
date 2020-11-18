/*
 * @Descripttion: 本地缓存
 * @Author: 王月
 * @Date: 2020-09-16 13:43:59
 * @LastEditors: 王月
 * @LastEditTime: 2020-09-17 10:34:03
 */
// 开源storage的库，对localstorage和sessionstorage的封装
import storage from 'good-storage';

const TOKEN = '_loginToken_'; // 登录token
const FRESH_TOKEN = '_refreshToken_'; // 登录token
const JURISDICTION_STATUS = '_jurisdictionStatus_'; // 权限状态

// 存储用户token
export function saveUserToken(token) {
    storage.set(TOKEN, token);
}
// 获取token
export function getUserToken() {
    return storage.get(TOKEN);
}
// 删除token
export function delUserToken() {
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
// 设置权限
export function setJurisdiction(data) {
  storage.set(JURISDICTION_STATUS, data);
}
// 获取权限
export function getJurisdiction() {
  storage.set(JURISDICTION_STATUS);
}
