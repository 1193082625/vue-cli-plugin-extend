/*
 * @Author: your name
 * @Date: 2020-11-20 13:16:25
 * @LastEditTime: 2020-11-20 14:49:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gather-tools-front\src\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { getToken } from '@/cache';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  }
];

const router = new VueRouter({
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
