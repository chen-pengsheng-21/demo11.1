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
            ><a href="/admin/school/depart">部门管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="departs" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        
        <el-table-column prop="departName" label="部门"> </el-table-column>
        <el-table-column prop="departCode" label="英文"> </el-table-column>
        <el-table-column prop="departType" label="部门类型" width="120">
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

    <el-dialog title="部门编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="depart" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="部门"
          prop="departName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="depart.departName"
            autocomplete="off"
            placeholder="请输入部门"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="英文"
          prop="departCode"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="depart.departCode"
            autocomplete="off"
            placeholder="请输入部门英文名称"
          ></el-input>
        </el-form-item>
       
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-form-item prop="departType">
            <el-select v-model="depart.departType" placeholder="请选择部门类型">
              <el-option label="学院" value="学院"> </el-option>
              <el-option label="处室" value="处室"> </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="departDesc"
          :label-width="formLabelWidth"
        >
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="depart.departDesc"
              ref="md"
            />
          </client-only>
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
      sch:{},
      handbook: "",
      dialogFormVisible: false,
      departs: [],
      depart: {
        id: 0,
        departName: "",
        departCode: "",
        schoolId: "",
        departDesc: "",
        departType: "",
      },
      page: {
        current: 0,
        size: 0,
        total: 0,
      },
      rules: {
        departName: [
          { required: true, message: "必填项", triggle: "blur" },
          {
            asyncValidator: (rule, value, callback) => {
              this.$axios({
                url: "/api/department/checkDepartName",
                method: "get",
                params: {
                  departName: value,
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
            message: "部门重复",
            triggle: "blur",
          },
        ],
        schoolId: [
          {
            type: "number",
            required: true,
            message: "必填项",
            triggle: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption",'school']),
  },
  created() {
    if (process.client) {

      this.sch=this.school;
    
      this.getDepartsBySchoolId(this.school.id)
    }
  },
  methods: {
   
    selectSchool(id) {
      this.depart.schoolId = id;
    },
    async getDepartsBySchoolId(schoolId){
      let res=await this.$axios({
        url:'/api/department/getDepartsBySchoolId',
        params:{
          schoolId:schoolId
        }
      }) 
      if(res.success){
          this.departs=res.data.departments;
      }
      else{
        this.$message.error(res.msg)
      }

    },
    
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.page.current = val;
      this.getDepartsByPage(val, 10);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.depart.id == 0) {
            this.$axios({
              url: "/api/department/add",
              method: "post",
              data: this.depart,
            })
              .then((res) => {
                if (res.success) {
                  this.getDepartsByPage(this.page.current);
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
              url: "/api/department/edit",
              method: "post",
              data: this.depart,
            })
              .then((res) => {
                if (res.success) {
                this.getDepartsByPage(this.page.current);
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

    toAdd() {
      let depart = {
        id: 0,
        departName: "",
        departCode: "",
        schoolId: "",
        departDesc: "",
      };
      this.depart = depart;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getDepart(id);
    },

    getDepart(id) {
      this.$axios({
        url: "/api/department/one",
        method: "get",
        params: {
          id: id,
        },
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((res) => {
          if (res.success) {
            this.depart = res.data.department;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });
        });
    },
  },
  watch: {
    "depart.departDesc": {
      handler(newDesc, oldDesc) {
        if (newDesc === null) {
          this.depart.departDesc = "";
        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>