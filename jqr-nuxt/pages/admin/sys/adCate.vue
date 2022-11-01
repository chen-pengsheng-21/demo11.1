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
            ><a href="/admin/school/depart">广告类型管理</a></el-breadcrumb-item
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
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="adCates" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>

        <el-table-column prop="name" label="广告类型"> </el-table-column>
        <el-table-column prop="width" label="广告宽度"> </el-table-column>
        <el-table-column prop="height" label="广告高度" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
        <template slot="empty">
          <el-empty :image-size="60"></el-empty>
        </template>
      </el-table>
    </el-main>

    <el-dialog
      title="广告类型编辑"
      width="60%"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="adCate" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="广告类型"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="adCate.name"
            autocomplete="off"
            placeholder="请输入广告类型"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告宽度"
          prop="width"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="adCate.width"
            autocomplete="off"
            placeholder="请输入广告宽度"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告高度"
          prop="height"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="adCate.height"
            autocomplete="off"
            placeholder="请输入广告高度"
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

      dialogFormVisible: false,
      adCates: [],
      adCate: {
        id: 0,
        name: "",
        with: "",
        height: 0,
      },
      page: {
        current: 0,
        size: 10,
        total: 1,
      },
      rules: {
        name: [
          { required: true, message: "必填项", triggle: "blur" },
          {
            asyncValidator: (rule, value, callback) => {
              this.$axios({
                url: "api/adcate/checkAdCateName",
                method: "get",
                params: {
                  name: value,
                },
              })
                .then((res) => {
                  if (res.success) {
                    callback();
                  } else {
                    callback(new Error(res.msg));
                  }
                })
                .catch((err) => {
                  callback(new Error("错误"));
                });
            },
            message: "广告类型重复",
            triggle: "blur",
          },
        ],

        width: [
          {
            required: true,
            message: "必填项",
            triggle: "blur",
          },
        ],

        height: [
          {

            required: true,
            message: "必填项",
            triggle: "blur",
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
      this.getAdCatesByPage(1);
    }
  },
  methods: {
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.page.current = val;
      this.getAdCatesByPage(val);
    },
    async getAdCatesByPage(current) {
      let page = {
        current: current,
        size: 10,
      };
      const res = await this.$axios({
        url: "api/adcate/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page=res.data.page;
        this.page=page;
        this.adCates=page.records;
        
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async getAdcate(id){
        const res=await this.$axios({
            url:'api/adcate/one',
            params:{
                id:id
            }
        })
        if(res.success){
            this.adCate=res.data.adCate;
            this.dialogFormVisible=true;
        }
        else{
            this.$message.error(res.msg);
            return false;
        }


    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.adCate.id == 0) {
            const res = await this.$axios({
              url: "api/adcate/add",
              method: "post",
              data: this.adCate,
            });
            if (res.success) {
                this.$message.success(res.msg);
            } else {
            }
          } else {
            const res = await this.$axios({
              url: "api/adcate/edit",
              method: "post",
              data: this.adCate,
            });
            if (res.success) {
                this.$message.success(res.msg);
                this.getAdCatesByPage(this.page.current);
                this.dialogFormVisible=false;

            } else {
                this.$message.error(res.msg);
                return false;

            }
          }
        } else {
          return false;
        }
      });
    },

    toAdd() {
      let adCate = {
        id: 0,
        name: "",
        width: "",
        height: "",
      };
      this.adCate = adCate;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getAdcate(id);
    },
  },

};
</script>

<style>
</style>