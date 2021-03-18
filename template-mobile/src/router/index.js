/*
 * @Author: your name
 * @Date: 2020-11-20 13:16:25
 * @LastEditTime: 2021-03-18 15:06:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gather-tools-front\src\router\index.js
 */
import { createRouter, createWebHashHistory } from "vue-router";

const routeFiles = require.context("./", false, /\.router.js$/);
const routes = [];
routeFiles.keys().forEach(key => {
  routes.push(...routeFiles(key).default);
});

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
    const token = getToken();
    if (!token && to.name !== 'login') {
        let j = {
            n: to.name,
            g: to.params,
            i: to.query
        }
        next({ path: '/login', query: j });
    } else {
        // 如果用户未能验证身份，则 `next` 会被调用两次
        next();
    }
})
export default router;
