<template>

    <div id="login">

      <el-row>
        <el-col :span="24">
          <h1></h1>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4" :offset="10">
          <el-form :model="loginForm" ref="loginForm" :label-position="'right'" :rules="logRules" label-width="80px" @keydown.native="enterLogin($event)">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" :disabled="processing"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" :disabled="processing"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" :loading="processing">Login</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

    </div>

</template>


<script>
  export default {
    name: 'login',
    data () {
      return {
        loginForm: {
          username: '',
          password: '',
        },

        processing: false,

        logRules: {
          username: [
            {required: true, message: '请输入账号'}
          ],
          password: [
            {required: true, message: '请输入密码'}
          ]
        }
      }
    },


    created () {
      if (this.$route.query.logout) {
        this.$store.dispatch('userLogout')
      }
    },


    methods: {
      login () {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.processing = true
            this.axios.post('/login', this.loginForm).then(resp => {
              this.processing = false

              console.log(resp)

              this.$store.commit('set_token', resp.meta.token)
              this.$store.commit('set_perms', resp.meta.role)
              this.$store.commit('set_username', resp.data.username)

              if (this.$route.query.redirect) {
                this.$router.replace({path: this.$route.query.redirect})
              } else {
                this.$router.push({name: 'home'})
              }
            })
            .catch(error => {
              this.processing = false
              console.log(error)
            })

          } else {
            console.log('>>>>> Invalid!')
          }
        })
        return
      },

      enterLogin (e) {
        if (e.keyCode == 13) {
          this.login()
        }
        return
      }
    }
  }
</script>
