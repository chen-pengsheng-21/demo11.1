<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo?userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/my/rbac/api">接口管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{userinfo?userinfo.userName:''}}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  layout: "my",
  data(){
      return{
         
      }
  },
  computed:{
    ...mapState(['school','userinfo'])

  },
  created(){
    if(process.client){
   
    }

  }
};
</script>

<style scoped>

</style>