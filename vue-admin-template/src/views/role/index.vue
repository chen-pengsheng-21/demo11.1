<template>
  <div>
    <div class="lookup">
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click="toAdd"
      ></el-button>
    </div>
    <el-table :data="newData" border style="width: 100%" >
    
        <el-table-column prop="name" label="名称" width="180">
       
        </el-table-column>
        <el-table-column
          prop="describe"
          label="描述"
          align="center"
        ></el-table-column>
        <el-table-column prop="enable" label="激活?" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.enable | enable }}
          </template>
        </el-table-column>
      <el-table-column fixed="right" label="操作" align="left" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="toSub(scope.row.id, 'sub')"
            v-if="scope.row.pid == 0"
            >添加子角色</el-button
          >
          <el-button size="mini" type="danger" @click="del(scope.$index, 'del')"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="toUpdate(scope.$index, 'update')"
            >更新</el-button
          >
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
    <el-dialog title="编辑权限" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" label-width="80px" ref="form">
        <el-form-item prop="name" label="名称">
          <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item prop="describe" label="描述">
          <el-input v-model="form.describe"></el-input>
        </el-form-item>
        <el-form-item prop="enable" label="激活?">
          <el-switch v-model="form.enable"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = !dialogFormVisible"
          >取 消</el-button
        >
        <el-button type="primary" @click="edit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles,getRoot, add, update } from "@/api/role";
import { deepClone } from "@/utils/utils";
export default {
  data() {
    return {
      newData: [],
      dialogFormVisible: false,
      page: {
        current: 1, // 当前分页
        size: 10, // 显示数量
      },
      total: 0,
      form: {
        id: 0,
        name: "",
        describe: "",
        pid: 0,
        enable: true,
      },
      updateForm: [],
      rules: {
        name: [
          {
            required: true,
            pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{3,50})$/,
            message:
              "请输入权限名称,必须以字母为开头，英文,数字、下划线和减号 3-50位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRoleByPage();
  },
  methods: {
    async handleSizeChange(newSize) {
      this.page.size = newSize;
      await this.getRoleByPage();
    },
    async handleCurrentChange(newSize) {
      this.page.current = newSize;
      await this.getRoleByPage();
    },
    async getRoleByPage() {
      const that = this;
      let params = {
        countPerPage: that.page.size,
        currentPage: that.page.current,
      };
      return new Promise((resolve, reject) => {
        getRoot(params)
          .then((res) => {
            if (res.code == 1) {
              that.newData = res.data.rows;
              that.total = res.data.count;
            } else {
              that.$message({
                message: res.msg,
                type: "warning",
              });
              this.newData = null;
            }
            resolve();
          })
          .catch((err) => {
            reject(err);
            that.$message({
              message: err,
              type: "error",
            });
          });
      });
    },
    toAdd() {
      this.dialogFormVisible = true;
      this.form.pid=0;
    },
    toSub(id) {
      this.dialogFormVisible = true;
      this.form.pid = id;
    },
    toUpdate(index) {
      this.dialogFormVisible = true;
      let role = this.newData[index];
      console.log(role);
      this.form = deepClone(role);
      this.form.enable = role.enable == 0 ? false : true;
    },
    async edit() {
      //this.$message("编辑中")
      console.log(this.form);
      let that = this;
      let role = that.form;
      role.enable = that.form.enable ? 1 : 0;
      if (role.id > 0) {
        return new Promise((resolve, reject) => {
          update(role)
            .then((res) => {
              if (res.code == 1) {
                that.getRoleByPage();
                that.dialogFormVisible = false;
              } else {
                that.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              resolve();
            })
            .catch((err) => {
              reject(err);
              that.dialogFormVisible = false;
              that.$message({
                message: err,
                type: "error",
              });
            });
        });
      } else {
        return new Promise((resolve, reject) => {
          add(role)
            .then((res) => {
              if (res.code == 1) {
                that.getRoleByPage();
                that.dialogFormVisible = false;
              } else {
                that.$message({
                  message: res.msg,
                  type: "error",
                });
              }
              resolve();
            })
            .catch((err) => {
              reject(err);
              that.dialogFormVisible = false;
              that.$message({
                message: err,
                type: "error",
              });
            });
        });
      }
    },
  },
  filters: {
    enable(val) {
      let result = "未激活";
      if (val == 1) {
        result = "激活";
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
</style>