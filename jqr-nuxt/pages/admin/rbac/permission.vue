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
            ><a href="/my/doc">权限管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo?userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="primary" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table
        :data="permissions"
        border
        row-key="id"
        lazy
        style="width: 100%"
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        >
        <el-table-column fixed prop="code" label="权限"> </el-table-column>
        <el-table-column fixed prop="description" label="权限描述">
        </el-table-column>
        <el-table-column fixed prop="url" label="权限路径"> </el-table-column>
        <el-table-column prop="type" label="权限类型">
          <!-- <template slot-scope="scope">
            <el-select
              v-model="permissions[scope.$index]['type']"
              placeholder="请选择"
            >
              <el-option label="路径权限" value="路径权限"> </el-option>
              <el-option label="按钮权限" value="按钮权限"> </el-option>
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column prop="pid" label="父编号"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.pid == 0"
              @click="toAddSubPermission(scope.row.pid)"
            >
              添加子权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  layout: "my",

  data() {
    return {

      dialogFormVisible: false,
      formLabelWidth: "100px",
      span: 8,
      sch:{},
      permissions: [],
      hasPermissions: [],
      permission: {
        code: "",
        description: "",
        url: "",
        type: "路径权限",
        pid: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo",'school']),
  },
  created() {
    if (process.client) {

      this.sch=this.school;
      //this.getPermissionsPage(1);
      this.getPermissionsByPid(0);
    }
  },
  methods: {
    async getPermissionsByPid(pid) {
      let res = await this.$axios({
        url: "/api/permission/getPermissionByPid",
        method: "get",
        params: {
          pid: pid,
        },
      });
      if (res.success) {
        this.permissions = res.data.permissions;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async load(tree, treeNode, resolve) {
      console.log(tree.id);
      let res = await this.$axios({
        url: "/api/permission/getPermissionByPid",
        method: "get",
        params: {
          pid: tree.id,
        },
      });
      if (res.success) {
        resolve(res.data.permissions);
      }
    },
    async getPermission(id){
      let res= await this.$axiod({
        url:'/api/permission/one',
        params:{
          id:id
        }
      })
      if(res.success){
        this.permission=res.data.permission;
      }
      else{
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }

    },
    toAdd() {
      let permission = {
        code: "",
        description: "",
        url: "",
        type: "路径权限",
        pid: 0,
      };
      this.permission=permission;
    },
    toEdit(id) {
      let permission = {
        code: "",
        description: "",
        url: "",
        type: "路径权限",
        pid: 0,
      };
      this.permission=permission;
      this.getPermission(id)

    },
    toAddSubPermission(pid) {
      let permission = {
        code: "",
        description: "",
        url: "",
        type: "路径权限",
        pid: 0,
      };
      this.permission=permission;
      this.permission.pid=pid;

    },
  },
};
</script>

<style>
</style>