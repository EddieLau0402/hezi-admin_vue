import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import axios from './http'
import VueAxios from 'vue-axios'
import router from './router'

Vue.use(Vuex)
Vue.use(VueAxios, axios)


const store = new Vuex.Store({
  state: {
    username: null,
    perms: window.localStorage.getItem('_perms') ? JSON.parse(window.localStorage.getItem('_perms')) : [],
    token: null // 登录凭证
  },
  mutations: {
    set_username (state, username) {
      window.localStorage.setItem('_username', username)
      state.username = username
    },

    set_token (state, token) {
      window.localStorage.setItem('_token', token)
      state.token = token
    },

    set_perms (state, perms) {
      window.localStorage.setItem('_perms', JSON.stringify(perms))
      state.perms = perms
    },

    clear_login_data (state) {
      window.localStorage.removeItem('_token')
      window.localStorage.removeItem('_perms')
      window.localStorage.removeItem('_username')

      state.username = state.role = state.token = null
      state.perms = []
    }
  },
  actions: {
    userLogin ({commit}, params) {
      console.log('>>>>> user login...')
      console.log(params)
      // return
      /*
       * [模拟] 构造登录成功后接口返回数据
       */

      Vue.axios.post('/login', params).then(resp => {
        console.log('response ++++++ : ', resp)
      }).catch(err => {
        console.log('error: ', err)
      })




      // commit('set_user', userData)
      // commit('set_auth_token', loginToken)

      /// 登录成功跳转
      // router.push({name: 'home'})

    },
    userLogout () {
      console.log('>>>>> user logout...')
      store.commit('clear_login_data')
    }


  }
})


export default store
