<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my"
              >{{ userinfo ? userinfo.userType : "" }}中心</a
            ></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/my/rabc/doc">绑定学生管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo ? userinfo.userName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
     
      <el-table
        :data="users"
        border
        style="width: 100%"
        :default-expand-all="true"
        element-loading-text="拼命加载中"
      >
        <el-table-column fixed prop="userinfo.id" label="#" width="50">
        </el-table-column>
        <el-table-column fixed prop="userinfo.userName" label="用户账号">
        </el-table-column>
        <el-table-column prop="userinfo.userType" label="用户类型">
        </el-table-column>
        <el-table-column prop="student.studentNo" label="学号">
        </el-table-column>
        <el-table-column prop="student.studentName" label="姓名">
        </el-table-column>
        <el-table-column prop="student.classinfo" label="班级" width="150">
        </el-table-column>
        <el-table-column prop="student.major" label="专业" width="100"> </el-table-column>
        <el-table-column prop="student.depart" label="部门" width="100"> </el-table-column>
        <el-table-column prop="student.school" label="学校" width="150"> </el-table-column>
        <el-table-column prop="userinfo.state" label="状态"> 
            <template slot-scope="scope">
            <el-select
              v-model="users[scope.$index].userinfo.state"
              placeholder="请选择"
            >
              <el-option label="未激活" :value="0"> </el-option>
              <el-option label="激活" :value="1"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="toAddRole(scope.row.userinfo.id)"
            >
              添加角色
            </el-button>
          </template>
        </el-table-column>
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
    <el-dialog title="选择角色" width="60%" :visible.sync="dialogRoleVisible">
      <el-checkbox-group v-model="checkRoles" @change="handleCheckedRoelChange">
        <el-row>
          <el-col :span="span" v-for="role in roles" :key="role.id">
            <el-checkbox :value="role.id" :label="role.id">{{
              role.description
            }}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUserRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  layout: "my",
  data() {
    return {
      userType: "",
      userName: "",
      dialogFormVisible: false,
      dialogRoleVisible: false,
      formLabelWidth: "100px",
      sch: {},
      span: 8,
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
    
      users: [],
      roles: [],
      checkRoles: [], //配选中的roles
      userRole: {
        userId: 0,
        roleIds: "",
      },
     
    };
  },
  computed: {
    ...mapState(["userinfo",  "school"]),
  },
  created() {
    if (process.client) {
      this.getUsers(1);
      this.getRoles();
    }
  },
  methods: {
    getUsers(current) {
      let page = {
        current: current,
        size: 10,
        schoolId: this.school.id,
      };

      this.$axios({
        url: "api/userinfo/page/getBindStudentVos",
        method: "post",
        data: page,
      })
        .then((res) => {
          if (res.success) {
            let page = res.data.page;
            console.log(page);
            this.users = page.records;
            this.page = page;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });
          this.dialogFormVisible = false;
          return false;
        });
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getUsers(val);
    },
    
    /**
     * 通过学生编号获取用户角色信息，
     * 保存到checkRoles
     *
     */
    async getUserRolesByUserId(userId) {
      let res = await this.$axios({
        url: "/api/userRole/getRoleIdsByUserId",
        method: "get",
        params: {
          userId: userId,
        },
      });
      if (res.success) {
        let ids = res.data.roleIds;
        ids.split(",").forEach((element) => {
          this.checkRoles.push(parseInt(element));
        });
      } else {
        this.$message({
          message: "还没有选择角色",
          center: true,
        });

        return false;
      }
    },
   
    getRoles() {
      this.$axios({
        url: "/api/role/colums",
        method: "get",
        params: {
          colums: "id, description",
        },
      })
        .then((res) => {
          if (res.success) {
            this.roles = res.data.roles;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogRoleVisible = false;
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });
          this.dialogRoleVisible = false;
          return false;
        });
    },
    toAddRole(id) {
      this.dialogRoleVisible = !this.dialogRoleVisible;
       this.userRole.userId=id;
      this.checkRoles = [];
      this.getUserRolesByUserId(id);
    },
    handleCheckedRoelChange(value) {
      console.log(value.join(","));
    },
    async saveUserRoles(){
       if(this.checkRoles.length==0){
        this.$message.error("角色不能为空")
        return;
      }
      let strIds=this.checkRoles.join(',');
      this.userRole.roleIds=strIds;
      let  res=await this.$axios({
        url:'api/userRole/saveOrUpdate',
        method:'post',
        data:this.userRole
      })
      if(res.success){
          this.$message.success(res.msg);
          this.dialogRoleVisible=false;
      }
      else{
         this.$message.error(res.msg)
        return false;
      }
    },
   
  },
};
</script>

<style>
</style>