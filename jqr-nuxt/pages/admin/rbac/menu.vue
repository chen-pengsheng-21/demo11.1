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
            ><a href="/my/doc">菜单管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school? school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="primary" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table
        :data="menus"
        border
        row-key="id"
        lazy
        style="width: 100%"
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        max-height="800"
      >
        >
        <el-table-column fixed prop="menuName" label="菜单"> </el-table-column>
        <el-table-column fixed prop="menuUrl" label="菜单路径">
        </el-table-column>
        <el-table-column fixed prop="description" label="权限描述">
        </el-table-column>
        <el-table-column prop="menuSort" label="排序"> </el-table-column>
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
              @click="toAddSubMenu(scope.row.id)"
            >
              添加子菜单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="菜单编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="menu" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="菜单"
          prop="menuName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="menu.menuName"
            autocomplete="off"
            placeholder="请输入菜单"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单地址"
          prop="menuUrl"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="menu.menuUrl"
            autocomplete="off"
            placeholder="请输入菜单地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单描述"
          prop="description"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="menu.description"
            autocomplete="off"
            placeholder="请输入菜单描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="父编号" prop="pid" :label-width="formLabelWidth">
          <el-input
            v-model="menu.pid"
            autocomplete="off"
            placeholder="请输入父编号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="子菜单?"
          prop="hasChildren"
          :label-width="formLabelWidth"
        >
          <el-select v-model="menu.hasChildren" placeholder="请选择">
            <el-option label="无" :value="0"> </el-option>
            <el-option label="有" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
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
      formLabelWidth: "100px",
      sch:{},
      menus: [],
      menu: {
        id: 0,
        menuName: "",
        menuUrl: "",
        description: "",
        menuSort: 50,
        pid: 0,
        hasChildren: 0,
      },
      rules: {
        menuName: [{ required: true, message: "必填项", triggle: "blur" }],
        menuUrl: [{ required: true, message: "必填项", triggle: "blur" }],
        
      },
    };
  },
  computed: {
    ...mapState(["userinfo","school"]),
  },
  created() {
    if (process.client) {

      this.sch=this.school;
      this.getMenusByPid(0);
    }
  },
  methods: {
    async getMenusByPid(pid) {
      let res = await this.$axios({
        url: "/api/menu/getMenusByPid",
        method: "get",
        params: {
          pid: pid,
        },
      });
      if (res.success) {
        this.menus = res.data.menus;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getMenu(id) {
      let res = await this.$axios({
        url: "/api/menu/one",
        method: "get",
        params: {
          id: id,
        },
      });
      if (res.success) {
     
        this.menu = res.data.frontendMenu;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    toAdd() {
      let menu = {
        id:0,
        menuName: "",
        menuUrl: "",
        description: "",
        menuSort: 50,
        pid: 0,
        hasChildren: 0,
      };
      this.menu = menu;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getMenu(id);
    },
    toAddSubMenu(id) {
      let menu = {
        id:0,
        menuName: "",
        menuUrl: "",
        description: "",
        menuSort: 50,
        pid: 0,
        hasChildren: 0,
      };
      this.menu = menu;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.menu.pid = id;
    },
    del(id) {},
     async load(tree, treeNode, resolve) {
      let res = await this.$axios({
        url: "/api/menu/getMenusByPid",
        params: {
          pid: tree.id,
        },
      });
      if (res.success) {
        resolve(res.data.menus);
      }
    },
    async edit(menu) {
      let res = await this.$axios({
        url: "/api/menu/edit",
        method: "post",
        data: menu,
      });
      if (res.success) {
        //更新页面数据
        this.getMenusByPid(0)
        
        this.dialogFormVisible = !this.dialogFormVisible;

      } else {
         this.$message({
          message: "数据更新失败，请联系管理员",
          center: true,
        });
        this.dialogFormVisible = !this.dialogFormVisible;
      }
    },
    async insert(menu) {
      let res = await this.$axios({
        url: "/api/menu/add",
        method: "post",
        data: menu,
      });
      if (res.success) {
        //更新页面数据
        this.getMenusByPid(0)
        this.dialogFormVisible = !this.dialogFormVisible;

      } else {
         this.$message({
          message: "数据添加失败，请联系管理员",
          center: true,
        });
        this.dialogFormVisible = !this.dialogFormVisible;
      }

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.menu.id == 0) {
            this.insert(this.menu)
          } else {
            //console.log(this.menu)
            this.edit(this.menu)
          }
        } else {
          this.$message({
            message: "数据验证不通过,请重新输入",
            center: true,
          });

          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>