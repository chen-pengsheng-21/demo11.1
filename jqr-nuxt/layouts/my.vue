<template>
  <el-container class="user">
    <el-aside
      height="100vh"
      width="200px"
      style="background-color: rgb(238, 241, 246)"
    >
      <div class="logo">
        <img src="/logo.png" alt="" srcset="" />   
      </div>

      <div class="user-menu">
        <el-menu
          :default-active="activeIndex"
          :router="router"
          :unique-opened="uniqueOpened"
        >
          <el-submenu :index="menu.menuUrl" v-for="menu in menus" :key="menu.id">
            <template slot="title">{{ menu.menuName }}</template>
            <el-menu-item :index="submenu.menuUrl" v-for="submenu in menu.children" :key="submenu.id">{{ submenu.menuName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <nuxt />
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      //token:false,
      activeIndex: "1",
      router: true,

      uniqueOpened: false,
     
    };
  },
  computed: {
    ...mapGetters(["userinfo", "menus"]),
  },
  created() {
    if (process.client) {
    
    }
    this.$nextTick(()=>{

      
    })
  },

  methods: {},

};
</script>

<style scoped>
.user {
  height: 100vh;
  overflow: hidden;
}
.user .logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: white;
  flex-direction: column;
}
.user .logo img {
  height: 50px;
  width: 50px;
}
.user .center {
  margin-top: 20px;
}

.el-aside {
  color: #333;
}
</style>