// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import axios from 'axios'
// import axios from './configs/http'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


Vue.config.productionTip = false



/**
 * 引入自制Cookies工具
 */
import cookies from './configs/cookies'
Vue.prototype.$cookies = cookies


/**
 * 加载样式
 */
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/style.scss'


/**
 * 引入 Element-ui
 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
/// 使用 Element-ui
Vue.use(ElementUI)

import App from './App'





/// 加载路由
import router from './configs/router'

import store from './configs/store'




/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})

