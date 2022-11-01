<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school/major">专业管理</a></el-breadcrumb-item
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
        <el-button type="danger" icon="el-icon-plus" @click="toAdd">添加</el-button>
      </div>
      <el-table :data="majors" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="schoolId" label="学校">
          <template slot-scope="scope">
            <el-select
              v-model="majors[scope.$index]['schoolId']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in schools"
                :key="item.id"
                :label="item.schoolName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="departId" label="部门">
          <template slot-scope="scope">
            <el-select
              v-model="majors[scope.$index]['departId']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departs"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="majorName" label="专业"> </el-table-column>
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

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </el-main>

    <el-dialog title="专业编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="major" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="专业"
          prop="majorName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="major.majorName"
            autocomplete="off"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>

        <el-form-item label="学校" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="schoolId">
              <el-select
                v-model="major.schoolId"
                placeholder="请选择学校"
                @change="selectSchool"
              >
                <el-option
                  v-for="item in schools"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="departId">
              <el-select v-model="major.departId" placeholder="请选择部门">
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item
          label="描述"
          prop="majorDesc"
          :label-width="formLabelWidth"
        >
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="major.majorDesc"
              ref="md"
            />
          </client-only>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">编辑</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
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
      span: 6,
  
      formLabelWidth: "100px",
      sch:{
      },
      handbook: "",
      schools: [],
      dialogFormVisible: false,
      departs: [],
      page: {
        current: 0,
        size: 0,
        total: 0,
      },
      major: {
        id: 0,
        majorName: "",
        schoolId: "",
        departId: "",
      },
      majors: [],
      rules: {
        majorName: [{ required: true, message: "必填项", triggle: "blur" }],
        schoolId: [
          {
            type: "number",
            required: true,
            message: "必填项",
            triggle: "blur",
          },
        ],
        departId: [
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
      this.getSchools();
      this.getDeaprts();
      this.getMajorsByPage(1);
    }
  },
  methods: {
    getSchools() {
      let arr = ["id", "school_name"];
      this.$axios({
        url: "/api/school/colums?colums=" + arr,
        method: "get",
      })
        .then((res) => {
          if (res.success) {
            this.schools = res.data.schools;
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
    getDeaprts() {
      let arr = ["id", "depart_name"];
      this.$axios({
        url: "/api/department/colums?colums=" + arr,
        method: "get",
      })
        .then((res) => {
          if (res.success) {
            this.departs = res.data.departments;
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
    getMajorsByPage(current) {
      let page = {
        current: current,
        size: 10,
        colums: ["id", "major_name", "depart_id", "school_id"],
      };

      this.$axios({
        url: "/api/major/page",
        method: "post",
        data: page,
      })
        .then((res) => {
          if (res.success) {
            let page = res.data.page;
            this.majors = page.records;
            this.page.current = page.current;
            this.page.size = page.size;
            this.page.total = page.total;
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
    getDeaprtsBySchoolId(id) {
      this.$axios({
        url: "/api/department/getDepartsBySchoolId",
        method: "get",
        params: {
          schoolId: id,
        },
      })
        .then((res) => {
          if (res.success) {
            console.log(res);
            this.departs = res.data.departments;
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

          return false;
        });
    },
    selectSchool(id) {
      this.getDeaprtsBySchoolId(id);
    },
    selectDepart(id) {
      this.major.departId = id;
    },
    toAdd() {
      let major = {
        id: 0,
        majorName: "",
        schoolId: "",
        departId: "",
      };
      this.major=major;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getMajor(id);
    },
    getMajor(id) {
      this.$axios({
        url: "/api/major/one",
        method: "get",
        params: {
          id: id,
        },
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((res) => {
          if (res.success) {
            this.major = res.data.major;
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
    handleCurrentChange(val) {
      this.getMajorsByPage(val);
    },
    handleSizeChange(val) {
      this.getMajorsByPage;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.major.id == 0) {
            this.$axios({
              url: "/api/major/add",
              method: "post",
              data: this.major,
            })
              .then((res) => {
                if (res.success) {
                  this.majors.push(this.major);
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
              url: "/api/major/edit",
              method: "post",
              data: this.major,
            })
              .then((res) => {
                if (res.success) {
                  this.majors.forEach((element) => {
                    element.id = this.major.id;
                    element = this.major;
                  });
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
  watch: {
    "major.majorDesc": {
      handler(newDesc, oldDesc) {
        if (newDesc === null) {
          this.major.majorDesc = "";
        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>