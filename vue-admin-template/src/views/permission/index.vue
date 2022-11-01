
<template>
  <!-- 混合查询 -->
  <div>
    <div class="lookup">
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click="toAdd"
      ></el-button>
    </div>
    <el-table :data="newData" border style="width: 100%">
      <el-table-column prop="router_name" label="路由名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.pid | addPlus }} {{ scope.row.router_name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="router_code"
        label="路径"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="redirect"
        label="重定向"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="component"
        label="组件"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="hasMeta|hasMeta"
        label="hasMeta"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.hasMeta | hasMeta }}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.type | type }}
        </template>
      </el-table-column>

      <el-table-column prop="hidden" label="隐藏" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.hidden | hidden }}
        </template>
      </el-table-column>
      <el-table-column
        prop="hasChildren"
        label="子元素?"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.hasChildren | hasChildren }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="left" width="350">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="toSub(scope.$index)"
            >添加子权限</el-button
          >
          <el-button size="mini" type="danger" @click="del(scope.row.id)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="toUpdate(scope.$index)"
            >更新</el-button>
            <el-button
            size="mini"
            type="danger"
            v-if="scope.row.hasChildren==1"
            @click="sub(scope.row.pid)"
            >子权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 发布permission -->
    <el-dialog title="编辑权限" :visible.sync="dialogFormVisible" >
      <el-form :model="form" :rules="rules" label-width="80px" ref="form">
        <el-form-item prop="router_name" label="路由名称">
          <el-input v-model="form.router_name"></el-input>
        </el-form-item>
        <el-form-item prop="router_code" label="路由路径">
          <el-input v-model="form.router_code"></el-input>
        </el-form-item>
        <el-form-item prop="component" label="组件">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item prop="redirect" label="重定向">
          <el-input v-model="form.redirect"></el-input>
        </el-form-item>
        <el-form-item label="路由类型">
          <el-select
            v-model="form.type"
            @change="changeType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="hasMeta">
          <el-switch v-model="form.hasMeta"></el-switch>
        </el-form-item>
        <template v-if="form.hasMeta">
          <el-form-item label="页面标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="激活">
          <el-switch v-model="form.enable"></el-switch>
        </el-form-item>
        <el-form-item label="隐藏">
          <el-switch v-model="form.hidden"></el-switch>
        </el-form-item>
        <el-form-item label="子路由?">
          <el-switch v-model="form.hasChildren"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = !addVisible">取 消</el-button>
        <el-button type="primary" @click="editPremission('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils/utils";
// import { get, post } from "@/utils/request.js";
import {
  getPermissionByPages,
  addPermission,
  updatePermission,
  getRoot
} from "@/api/permission";
export default {
  components: {},
  data() {
    return {
      addVisible: false,
      dialogFormVisible: false,
      page: {
        current: 1, // 当前分页
        size: 10, // 显示数量
      },
      total: 0,
      newData: [],
      form: {
        id: 0,
        router_name: "",
        router_code: "",
        redirect: "",
        component: "Layout",
        enable: true,
        title: "",
        type: "",
        icon: "",
        pid: 0,
        hidden: true,
        hasMeta: false,
        hasChildren: false,
      },
      types: [
        { value: 0, label: "路径" },
        { value: 1, label: "按钮" },
        { value: 2, label: "固定" },
      ],

      rules: {
        router_name: [
          {
            pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{1,255})$/,
            message:
              "请输入路由名称,必须以字母为开头，英文,数字、下划线和减号 1-255位",
            trigger: "blur",
          },
        ],
        router_code: [
          {
            required: true,
            message: "请输入路由路径,例如:/user/index",
            trigger: "blur",
          },
        ],
        redirect: [
          {
            message: "请输入重定向,例如:/user/index",
            trigger: "blur",
          },
        ],
        component: [
          {
            required: true,
            message: "请输入组件地址,默认组件Layout,例如:/view/user/index",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 分页显示数量
    handleSizeChange(newSize) {
      this.page.size = newSize;
      this.searchPermissions();
    },
    // 分页当前分页
    handleCurrentChange(newPage) {
      this.page.current = newPage;
      this.searchPermissions();
    },

    async searchPermissions() {
      let params = {
        countPerPage: this.page.size,
        currentPage: this.page.current,
      };
      return new Promise((resolve, reject) => {
        getPermissionByPages(params)
          .then((res) => {
            if (res.code == 1) {
              this.newData = res.data[0].rows;
              this.total = res.data[0].count;
            } else {
              this.$message({
                type:'error',
                message:res.msg
              })
              this.newData = null;
            }
            resolve();
          })
          .catch((err) => {
            this.$message({
                type:'error',
                message:err
              })
            reject(err);
          });
      });
    },
    toSub(index, type) {
      this.dialogFormVisible = true;
      let permission = this.newData[index];
      this.form.pid = permission.id;
    },
    toAdd() {
      this.dialogFormVisible = true;
    },
    editPremission(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          let prenission = that.form;
          prenission.enable = prenission.enable ? 1 : 0;
          prenission.hasMeta = prenission.hasMeta ? 1 : 0;
          prenission.hasChildren = prenission.hasChildren ? 1 : 0;
          prenission.hidden = prenission.hidden ? 1 : 0;
          if (prenission.id > 0) {
            return new Promise((resolve, reject) => {
              updatePermission(prenission)
                .then((res) => {
                  if (res.code == 1) {
                    this.$notify({
                      message: res.msg,
                      type: "success",
                    });
                  } else {
                    this.$notify({
                      message: res.msg,
                      type: "warning",
                    });

                    this.newData = null;
                  }
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            });
          } else {
            return new Promise((resolve, reject) => {
              addPermission(prenission)
                .then((res) => {
                  if (res.code == 1) {
                    this.$notify({
                      message: res.msg,
                      type: "success",
                    });
                  } else {
                    this.$notify({
                      message: res.msg,
                      type: "warning",
                    });
                    this.newData = null;
                  }
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                })
                .finally(() => {
                  that.dialogFormVisible = false;
                });
            });
          }
        } else {
          console.log("error submit!!");

          return false;
        }
      });
    },
    changeType(value) {
      this.form.type = value;
    },
    del(index, type) {},
    toUpdate(index, type) {
      let permission = this.newData[index];
      this.form = permission;
      this.form.hasMeta = permission.hasMeta == 0 ? false : true;

      this.types.forEach((obj) => {
        if (obj.value == permission.type) {
          this.form.type = obj.label;
        }
      });
      this.dialogFormVisible = true;
    },
  },
  created() {
    this.searchPermissions();
  },
  mounted() {},
  filters: {
    hasMeta: function (val) {
      let result = "无";
      if (val == 1) {
        result = "有";
      }
      return result;
    },
    hasChildren: function (val) {
      let result = "无";
      if (val == 1) {
        result = "有";
      }
      return result;
    },
    hidden: function (val) {
      let result = "隐藏";
      if (val == 1) {
        result = "可视";
      }
      return result;
    },
    type: function (val) {
      let result = "路径";
      if (val == 1) {
        result = "可视";
      } else if (val == 2) {
        result = "固定";
      }
      return result;
    },
    addPlus(val) {
      if (val > 0) {
        return "----";
      }
    },
  },
};
</script>
<style scoped>
.lookup {
  display: flex;
  margin: 0 20px;
  justify-content: flex-end;
}
.aInput {
  width: 70%;
}
.btns {
  margin-left: 10px;
  margin-right: 10px;
}
</style>