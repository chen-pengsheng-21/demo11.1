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
            ><a href="/admin/doc/interview/type"
              >面试分类管理</a
            ></el-breadcrumb-item
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
      <div class="intervie-type-add">
        <h3>面试题库</h3>
        <el-button type="primary" icon="el-icon-edit" @click="toAdd"
          >新建</el-button
        >
      </div>
      <div class="intervie-type-list">
        <el-table :data="interiewTypes" border stripe>
          <el-table-column prop="id" label="#" width="50px"> </el-table-column>
          <el-table-column prop="typeName" label="类型名称"> </el-table-column>
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
      </div>
    </el-main>
    <el-dialog
      title="面试题目类型编辑"
      width="60%"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="interiewType" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="题目类型"
          prop="typeName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="interiewType.typeName"
            autocomplete="off"
            placeholder="请输入面试题目类型名称"
          ></el-input>
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
      formLabelWidth: "100px",
      interiewTypes: [],
      interiewType: {
        id: "",
        typeName: "",
      },
      dialogFormVisible: false,
      rules: {
        typeName: [
          {
            required: true,
            message: "请输入面试题目类型名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  created() {
    if (process.client) {
      this.getInterviewTypes();
    }
  },
  methods: {
    async getInterviewTypes() {
      let res = await this.$axios({
        url: "api/interviewType/all",
      });

      if (res.success) {
        this.interiewTypes = res.data.interviewTypes;
      } else {
        return false;
      }
    },
    async toAdd() {
    let  interiewType= {
        id: 0,
        typeName: "",
      };
      this.interiewType=interiewType;
      this.dialogFormVisible = true;
    },
    async toEdit(id) {
      let res = await this.$axios({
        url: "api/interviewType/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.interiewType = res.data.interviewType;
        this.dialogFormVisible = true;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async editInterviewType(interiewType, formName) {
      let res = await this.$axios({
        url: "api/interviewType/edit",
        method: "post",
        data: interiewType,
      });
      if (res.success) {
        this.dialogFormVisible = false;
        this.getInterviewTypes();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async addInterviewType(interiewType, formName) {
      let res = await this.$axios({
        url: "api/interviewType/add",
        method: "post",
        data: interiewType,
      });
      if (res.success) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
        this.getInterviewTypes();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.interiewType.id == 0) {
            this.addInterviewType(this.interiewType, formName);
          } else {
            this.editInterviewType(this.interiewType, formName);
          }
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.intervie-type-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>