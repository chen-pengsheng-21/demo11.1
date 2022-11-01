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
            ><a href="/my/rbac/role">角色管理</a></el-breadcrumb-item
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
      <el-table :data="roles" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column fixed prop="roleName" label="角色"> </el-table-column>
        <el-table-column fixed prop="description" label="角色描述">
        </el-table-column>
        <el-table-column prop="status" label="激活">
          <template slot-scope="scope">
            <el-select
              v-model="roles[scope.$index]['status']"
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
            <el-button
              type="text"
              size="small"
              @click="toAddPermission(scope.row.id)"
            >
              菜单权限
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
    <el-dialog title="角色编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="role" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="专业"
          prop="roleName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="role.roleName"
            autocomplete="off"
            placeholder="请输入角色"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="专业描述"
          prop="description"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="role.description"
            autocomplete="off"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option label="未激活" :value="0"> </el-option>
            <el-option label="激活" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="权限选择"
      width="40%"
      :visible.sync="dialogPermissionVisible"
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
        <el-button @click="dialogPermissionVisible = false">取 消</el-button>
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
      dialogPermissionVisible: false,
      formLabelWidth: "100px",
      sch: {},
      span: 8,
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
      roles: [],
      role: {
        id: 0,
        roleName: "",
        description: "",
        status: 1,
      },
      roleMenu: {
        id: 0,
        roleId: 0,
        frontendMenuIds: "",
      },
      menuTree: [],
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      defaultCheckedKeys: [],
      roleHasFrontendMenu: false, //判断该角色是否有菜单权限：
      rules: {
        roleName: [{ required: true, message: "必填项", trigger: "blur" }],
        description: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },

  created() {
    if (process.client) {
   
      this.sch = this.school;
      this.getRolesPage(1);
      this.getMenuTree();
    }
  },
  methods: {
    async getRolesPage(current) {
      let page = {
        current: current,
        size: 10,
        colums: ["id", "role_name", "description", "status"],
      };
      let res = await this.$axios({
        url: "/api/role/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.roles = page.records;
        this.page = page;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getRoleById(id) {
      let res = await this.$axios({
        url: "/api/role/one",
        method: "get",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.role = res.data.role;
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
        return;
      }
      this.roleMenu.frontendMenuIds = menuIds.join(",");
      let res = await this.$axios({
        method: "post",
        url: "api/roleFrontendMenu/saveOrUpdate",
        data: this.roleMenu,
      });
      if (res.success) {
        this.$message({
          message: `添加权限${res.msg}`,
          center: true,
        });
        this.$refs.tree.setCheckedKeys([]); //清空选中
        this.dialogPermissionVisible = false;
      } else {
        this.$refs.tree.setCheckedKeys([]);
        this.dialogPermissionVisible = false;
        this.$message({
          message: `添加权限${res.msg},请联系管理员`,
          center: true,
        });
      }
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

    handleCurrentChange(current) {
      this.page.current = current;
      this.getRolesPage(current);
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getRoleById(id);
    },
    del(id) {},
    toAdd() {
      let role = {
        id: 0,
        roleName: "",
        description: "",
        status: 1,
      };
      this.role = role;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    async toAddPermission(roleid) {
     

      this.roleMenu.roleId = roleid; //添加角色

      let res = await this.$axios({
        url: "api/roleFrontendMenu/getFrontendMenuIdsByRoleId",
        params: {
          roleId: roleid,
        },
      });
      if (res.success) {
        this.roleHasFrontendMenu = true;
        this.defaultCheckedKeys = res.data.ids;
      } else {
        this.roleHasFrontendMenu = false;
        
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys([])
       })
      }
       //设置权限
      this.dialogPermissionVisible = true;

      
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.role.id == 0) {
            this.$axios({
              url: "/api/role/add",
              method: "post",
              data: this.role,
            })
              .then((res) => {
                if (res.success) {
                  this.getRolesPage(this.page.current);
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
              url: "/api/role/edit",
              method: "post",
              data: this.role,
            })
              .then((res) => {
                if (res.success) {
                  this.getRolesPage(this.page.current);
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