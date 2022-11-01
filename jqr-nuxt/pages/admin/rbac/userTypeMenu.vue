<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{userinfo? userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/my/rbac/userTypeMenu">用户类型菜单</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName:'' }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="primary" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="userTypeMenus" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column fixed prop="userType" label="用户类型"> 
          

        </el-table-column>
        <el-table-column fixed prop="menuIds" label="菜单编号">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="del(scope.row.id)">
              删除
            </el-button>
          
          </template>
        </el-table-column>
      </el-table>

    </el-main>
    <el-dialog title="用户类型菜单编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="userTypeMenu" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="用户类型"
          prop="userType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="userTypeMenu.userType" placeholder="请选择">
            <el-option label="学生" value="学生"> </el-option>
            <el-option label="教师" value="教师"> </el-option>
            <el-option label="教辅" value="教辅"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="菜单权限"
          prop="menuIds"
          :label-width="formLabelWidth"
        >
        <el-col :span="6">
          <el-input
            v-model="userTypeMenu.menuIds"
            autocomplete="off"
            placeholder="请输入菜单"
            disabled
          ></el-input>
        </el-col>
        <el-col :span="6">
            <el-button
              type="text"
              size="small"
              @click="toAddUserTypeMenus(userTypeMenu.menuIds)"
            >
              选择菜单
            </el-button>
        </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="权限选择"
      width="40%"
      :visible.sync="dialogUserTypeMenuVisible"
    >
      <el-tree
        :data="menuTree"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        check-on-click-node
        :check-strictly="true"
        :expand-on-click-node="false"
        :props="defaultProps"
        @node-click="nodeClick"
        :default-checked-keys="defaultCheckedKeys"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserTypeMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
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
      dialogUserTypeMenuVisible: false,
      formLabelWidth: "100px",
      sch: {},
      span: 8,
      
      userTypeMenus: [],
      userTypeMenu: {
        id: 0,
        userType: "",
        menuIds: "",
      },
     
      menuTree: [],
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      defaultCheckedKeys: [],
      roleHasFrontendMenu: false, //判断该角色是否有菜单权限：
      rules: {
        userType: [{ required: true, message: "必填项", trigger: "blur" }],
        menuIds: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },

  created() {
    if (process.client) {
      this.getUserTypeMenus();
      this.getMenuTree();
    }
  },
  methods: {
    async getUserTypeMenus() {
      
      let res = await this.$axios({
        url: "api/userTypeMenu/all",
      });
      if (res.success) {
        this.userTypeMenus=res.data.userTypeMenus
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getUserTypeById(id) {
      let res = await this.$axios({
        url: "/api/userTypeMenu/one",
        method: "get",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.userTypeMenu = res.data.userTypeMenu;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getMenuTree() {
      let res = await this.$axios({
        url: "/api/menu/tree",
        method: "get",
      });

      if (res.success) {
        this.menuTree = res.data.secondLevelMenuVos;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getCheckedKeys() {
      let menuIds = this.$refs.tree.getCheckedKeys();
      if (menuIds.length == 0) {
        this.$message({
          message: "权限最少选择一项",
          center: true,
        });
        return false;
      }
      let strMenuIds = menuIds.join(",");
      this.userTypeMenu.menuIds=strMenuIds;
      this.$refs.tree.setCheckedKeys([])
      this.dialogUserTypeMenuVisible=false;

     
    },
    nodeClick(data, node) {
      //这个方法是勾选父级子级也默认勾选 取消子级不影响父级
      this.childNodesChange(node);
      // 这个方法是勾选子级默认把父级也勾选上
      this.parentNodesChange(node);
    },
    parentNodesChange(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == "parent") {
            node[key].checked = true;
            this.parentNodesChange(node[key]);
          }
        }
      }
    },
    childNodesChange(node) {
      let len = node.childNodes.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          if (!node.checked) {
            node.childNodes[i].checked = false;
          } else {
            node.childNodes[i].checked = true;
          }
          this.childNodesChange(node.childNodes[i]);
        }
      }
    },

   
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
    

      this.getUserTypeById(id);
    },
    del(id) {},
    toAdd() {
     let  userTypeMenu= {
        id: 0,
        userType: "",
        menuIds: "",
      }
      this.userTypeMenu=userTypeMenu;
      this.dialogFormVisible = !this.dialogFormVisible;
    

    },
    async toAddUserTypeMenus(menuIds) {
      //设置权限
      this.dialogUserTypeMenuVisible = !this.dialogUserTypeMenuVisible;
      //获取已有权限
      //获取已有权限
      if (menuIds.length>0) {
          let strMenuIds=menuIds.split(',');
          let intMenuIds=strMenuIds.map(Number);
          console.log(intMenuIds);
          this.defaultCheckedKeys=intMenuIds;
      } else {
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys([])
       })
      }

      
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.userTypeMenu.id == 0) {
            this.$axios({
              url: "api/userTypeMenu/add",
              method: "post",
              data: this.userTypeMenu,
            })
              .then((res) => {
                if (res.success) {
                  this.getUserTypeMenus();
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
              url: "api/userTypeMenu/edit",
              method: "post",
              data: this.userTypeMenu,
            })
              .then((res) => {
                if (res.success) {
                  this.getUserTypeMenus();
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
.children {
  display: flex;
}
</style>