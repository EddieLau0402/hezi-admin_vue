<template>

  <div id="header">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="system">
          <router-link :to="{name: 'home'}">Admin system</router-link>
        </div>
      </el-col>
      <el-col :span="6" :offset="14" class="pt10">
        <div class="pull-right pt10 pr10 pl10 logout">
          <router-link :to="{name: 'login', query: {logout: '1'}}"><i class="fa fa-sign-out fa-lg mr4"></i>退出登录</router-link>
        </div>

        <div class="username pull-right pt10 pr10 pl10"><i class="fa fa-user fa-lg mr4"></i>{{ username }}</div>
      </el-col>
    </el-row>
  </div>

</template>


<script>

export default {
  name: 'header',
  data () {
    return {}
  },
  computed: {
    username () {
      return this.$store.state.username ? this.$store.state.username : '用户'
    }
  }
}

</script>
