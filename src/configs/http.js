import axios from 'axios'
import store from './store'
import router from './router'

import { Message } from 'element-ui'

let apiConfig = process.env.API

/**
 * axios 配置
 * @type {number}
 */
// axios.defaults.timeout = 5000;
axios.defaults.baseURL = apiConfig.schema + apiConfig.api +'.'+ apiConfig.base

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    if (store.state.token) {
      config.headers.Authorization = `Bearer ${store.state.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)


/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  response => {
    // console.log('>>>>> Origin-response: ', response)
    let extractedData = {}

    if (response.data) {
      extractedData = response.data
    }

    // _.forEach(response, function (val, key) {
    //   if (key !== 'data') {
    //     extractedData[key] = val
    //   }
    // })

    if (response.meta && response.meta.pagination) {
      extractedData.pagination = response.meta.pagination;
    }

    return extractedData
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          //// 401 清除token信息并跳转到登录页面
          store.commit('clear_login_data')
          router.replace({
            name: 'login',
            query: {redirect: router.currentRoute.fullPath}
          })
          break

        case 402:
        case 403:
        case 422:
          // console.log('>>>>> [ERROR] ===> ', error.response.data)
          Message({
            customClass: 'system-err',
            type: 'error',
            message: error.response.data.message
          })
          break

        case 500:
          console.log('>>>>> [ERROR] ===> ', error.response.data)
          Message({
            customClass: 'system-err',
            type: 'error',
            message: '服务器错误!',
          })
          break
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)

export default axios
