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
            ><a href="/my/doc">学校管理</a></el-breadcrumb-item
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
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"></el-button>
      </div>
      <el-table :data="users" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column fixed prop="userName" label="用户账号">
        </el-table-column>
        <el-table-column prop="userType" label="用户类型">
          <template slot-scope="scope">
            <el-select
              v-model="users[scope.$index]['userType']"
              placeholder="请选择"
            >
              <el-option label="学生" value="学生"> </el-option>
              <el-option label="教师" value="教师"> </el-option>
              <el-option label="教辅" value="教辅"> </el-option>
              <el-option label="管理员" value="管理员"> </el-option>
              <el-option label="后勤" value="后勤"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="binding" label="绑定">
          <template slot-scope="scope">
            <el-select
              v-model="users[scope.$index]['binding']"
              placeholder="请选择"
            >
              <el-option label="未绑定" :value="0"> </el-option>
              <el-option label="绑定" :value="1"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-select
              v-model="users[scope.$index]['state']"
              placeholder="请选择"
            >
              <el-option label="未激活" :value="0"> </el-option>
              <el-option label="激活" :value="1"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)">
            编辑
            </el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">
            删除
            </el-button>
            <el-button type="text" size="small" @click="toAddRole(scope.row.id)">
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
    <el-dialog title="学生编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="user" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="专业"
          prop="userName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="user.userName"
            autocomplete="off"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="类型"
          prop="userType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="user.userType" placeholder="请选择">
            <el-option label="学生" value="学生"> </el-option>
            <el-option label="教师" value="教师"> </el-option>
            <el-option label="教辅" value="教辅"> </el-option>
            <el-option label="管理员" value="管理员"> </el-option>
            <el-option label="后勤" value="后勤"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定" prop="binding" :label-width="formLabelWidth">
          <el-select v-model="user.binding" placeholder="请选择">
            <el-option label="未绑定" :value="0"> </el-option>
            <el-option label="绑定" :value="1"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="state" :label-width="formLabelWidth">
          <el-select v-model="user.state" placeholder="请选择">
            <el-option label="未激活" :value="0"> </el-option>
            <el-option label="激活" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    
      dialogFormVisible: false,
      dialogRoleVisible: false,
      formLabelWidth: "100px",
      sch:{},
      span: 8,
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
      user: {
        id:0,
        userName: "",
        userType: "",
        state: 1,
        binding: 0,
      },
      users: [],
      roles: [],
      checkRoles: [], //配选中的roles
      userRole: {
        userId: 0,
        roleIds: "",
      },
      rules: {
        userName:[
          {required:true,message:'必填项',trigger:'blur'}
        ]
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption","school"]),
  },
  created() {
    if (process.client) {
     
      this.sch=this.school;
      this.getUsers(1);
      this.getRoles();
    }
  },
  methods: {
    getUsers(current) {
      let page = {
        current: current,
        size: 10,
        colums: ["id", "user_name", "user_type", "state", "binding"],
      };

      this.$axios({
        url: "/api/userinfo/page",
        method: "post",
        data: page,
      })
        .then((res) => {
          if (res.success) {
            let page = res.data.page;
  
            this.users = page.records;
            this.page=page;
            
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
      this.page.current=val;
      this.getUsers(val);
    },
    getUser(id) {
      this.$axios({
        url: "/api/userinfo/one",
        method: "get",
        params: {
          id: id,
        },
      })
        .then((res) => {
          if (res.success) {
            this.user = res.data.userinfo;
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
          this.dialogFormVisible = false;
          return false;
        });
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
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getUser(id);
    },
    toAdd() {
      this.dialogFormVisible = !this.dialogFormVisible;
      let user = {
        userName: "",
        userType: "",
        state: 1,
        binding: 0,
      };
      this.user = user;
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
      this.checkRoles=[];
      this.getUserRolesByUserId(id);
    },
    handleCheckedRoelChange(value) {
      console.log(value.join(","));
    },
    saveUserRoles() {},
    del(id){

    },
     submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.user.id == 0) {
            this.$axios({
              url: "/api/userinfo/add",
              method: "post",
              data: this.user,
            })
              .then((res) => {
                if (res.success) {
                  this.getUsers(this.page.current)
                  this.dialogFormVisible = false;
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
          } else {
            this.$axios({
              url: "/api/userinfo/edit",
              method: "post",
              data: this.user,
            })
              .then((res) => {
                if (res.success) {
                 this.getUsers(this.page.current)
                  this.dialogFormVisible = false;
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
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
</style>