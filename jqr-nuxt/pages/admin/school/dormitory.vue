<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item><a href="/admin/school/dormitory">宿舍管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{sch.schoolName}}</div>
      </div>
    </el-header>

  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    layout:'my',
    data(){
        return{
         
            

        }
    },
    computed:{
        ...mapState(['userinfo','markdownOption','school'])
    },
    created(){
        if(process.client){
          
        }

    }



}
</script>

<style>

</style>