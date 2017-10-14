<template>
  <div id="home">

    <header-bar></header-bar>

    <el-row class="main">
      <el-col :span="3" class="left-wrapper">
        <side-bar></side-bar>
      </el-col>
      <el-col :span="21" class="right-wrapper">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>

</template>


<script>
  import HeaderBar from './Layout/Header'
  import SideBar from './Layout/Sidebar'

  export default {
    name: 'home',
    data () {
      return {}
    },

    components: {
      'header-bar': HeaderBar,
      'side-bar': SideBar
    }
  }
</script>
