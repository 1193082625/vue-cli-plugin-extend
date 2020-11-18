/*
 * @Descripttion: 接口调用demo
 * @Author: 王月
 * @Date: 2020-09-16 13:46:58
 * @LastEditors: 王月
 * @LastEditTime: 2020-09-16 13:47:38
 */
import service from './api';

export function getCoachList(data) {
    return service({
        url: '/api/url',
        method: 'get',
        data
    })
}