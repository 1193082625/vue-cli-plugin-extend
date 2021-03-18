/*
 * @Author: ECHO
 * @Date: 2021-03-18 14:58:27
 * @LastEditTime: 2021-03-18 15:06:52
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
// 全局路由
import Home from '@/views/Home.vue';
export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "404" */ '@/views/Login.vue'),
  },
  {
    path: '/:catchAll(.*)',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
  }
];
