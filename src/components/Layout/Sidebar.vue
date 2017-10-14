<template>

  <div id="sidebar">
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">


      <el-submenu index="menu.text" v-for="menu in menus" :key="menu.text">
        <template slot="title"><i class="el-icon-menu"></i>{{ menu.text }}</template>

        <el-menu-item index="submenu.state" v-for="submenu in menu.submenus" :key="submenu.state">
          <router-link :to="{name: submenu.state}"><i class="fa mr4" :class="submenu.icon"></i>{{ submenu.text }}</router-link>
        </el-menu-item>
      </el-submenu>


    </el-menu>


  </div>

</template>


<script>

  export default {
    name: 'sidebar',
    data () {
      return {
        menus: [
          {
            text: '商家管理',
            submenus: [
              {text: '商家列表', state: 'merchants', icon: 'fa-users'},
              {text: '应用列表', state: 'applications', icon: 'fa-cubes'}
            ]
          }
        ]
      }
    },
    methods: {
      handleOpen () {},
      handleClose () {}
    },
    computed: {

    }
  }

</script>
