// import Posts from './components/Post/Posts'
// import PostInfo from './components/Post/PostInfo'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

import Home from '../components/Home'
import Login from '../components/Login'

import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'

import Merchants from '../components/Merchant/Merchants'
import Applications from '../components/Merchant/Applications'


// 页面刷新时，重新赋值token
// console.log('>>>>> first check: ', window.localStorage.getItem('_token'))
if (window.localStorage.getItem('_token')) {
  store.commit('set_token', window.localStorage.getItem('_token'))
}


const router = new VueRouter({
  mode: 'history',
  routes: [
    // {path: '/', component: Posts},
    // {path: '/posts', component: Posts, name: 'posts'},
    // {path: '/posts/:id', component: PostInfo, name: 'post'},false

    {
      path: '/',
      component: Home,
      name: 'home',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/merchants',
          component: Merchants,
          name: 'merchants',
          meta: {
            requiresAuth: true,
            title: '商家列表'
          }
        },
        {
          path: '/applications',
          component: Applications,
          name: 'applications',
          meta: {
            requiresAuth: true,
            title: '商家应用'
          }
        }
      ],
    },

    {
      path: '/login',
      component: Login,
      name: 'login',
      meta: {
        requiresAuth: false
      }
    }
  ],
})

/**
 * 路由拦截: 登录状态判断
 */
router.beforeEach((to, from, next) => {
  // console.log('>>>>> from : ', from)
  // console.log('>>>>> to : ', to)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.token) {
      next({path: '/login', query: {redirect: to.fullPath}})
    }
  }

  next()
})

/**
 * 修改页面标题
 */
router.afterEach(route => {
  window.document.title = (route.meta.title ? route.meta.title + ' - ' : '') + 'Admin System'
})


export default router
