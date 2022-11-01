<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType :''}}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school/memorabilia"
              >大事件管理</a
            ></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{userinfo? userinfo. userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main>
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="memorabilias" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="userId" label="用户" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="memorabilias[scope.$index]['userId']"
              placeholder="请选择用户"
            >
              <el-option
                v-for="item in userinfos"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
         <template slot="empty">
        <el-empty :image-size="60"></el-empty>
      </template>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </el-main>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  layout: "my",
  data() {
    return {

      sch:{},
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
      userinfos:[],
      memorabilias: [],

      memorabilia: {},
    };
  },
  computed: {
    ...mapState(["userinfo",'school']),
  },
  created() {
    if (process.client) {
  
      this.sch=this.school;
      this.getMemorabiliasPage(1)
      this.getUserinfos();
    }
  },
  methods: {
    async getMemorabiliasPage(current) {
      let page={
        current:current,
        size:10,
        colums:['*']
      }
      let res = await this.$axios({
        url:'/api/memorabilia/page',
        method:'post',
        data:page
      });
      if(res.success){
        let page=res.data.page;
        this.memorabilias=page.records;
        this.page=page;
      }
      else{
        this.$message({
          message: res.msg,
          center: true,
        });
        return false;
      }
    },
    async getUserinfos(){
      let arr=['id','user_name'];
      let res=await this.$axios({
        url:'/api/userinfo/colums?colums='+arr
      })
      if(res.success){
        this.userinfos=res.data.userinfos;

      }
      else{
        this.$message({
          message: res.msg,
          center: true,
        });
        return false;
      }
    },
    handleCurrentChange(value) {
      this.page.current = value;
      this.getMemorabiliasPage(current);
    },

    toAdd(){

    },
    toEdit(){

    },
    del(){

    }
  },
};
</script>

<style scoped>
</style>