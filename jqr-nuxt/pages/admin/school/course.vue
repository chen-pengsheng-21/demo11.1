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
            ><a href="/admin/school/course">学校管理</a></el-breadcrumb-item
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
        <el-button type="primary" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
        <el-button type="danger" icon="el-icon-plus" @click="toImportCourseExcel"
          >导入课程信息</el-button
        >
      </div>
      <el-table :data="courses" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="name" label="课程"> </el-table-column>
        <el-table-column prop="courseNo" label="课程编号" width="100">
        </el-table-column>
        <el-table-column prop="nameEn" label="英文名称"> </el-table-column>

        <el-table-column prop="depart" label="部门" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="courses[scope.$index]['depart']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departs"
                :key="item.id"
                :label="item.departName"
                :value="item.departName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="major" label="专业" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="courses[scope.$index]['major']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in majors"
                :key="item.id"
                :label="item.majorName"
                :value="item.majorName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="courseType" label="课程类型" width="120">
          <template slot-scope="scope">
            <el-select
              v-model="courses[scope.$index]['courseType']"
              placeholder="请选择"
            >
              <el-option label="必修课" value="必修课"> </el-option>
              <el-option label="选修课" value="选修课"> </el-option>
              <el-option label="限选课" value="选课"> </el-option>
              <el-option label="公共课" value="公共课"> </el-option>
              <el-option label="其他" value="其他"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="课程状态" width="120">
          <template slot-scope="scope">
            <el-select
              v-model="courses[scope.$index]['state']"
              placeholder="请选择"
            >
              <el-option label="未激活" :value="0"> </el-option>
              <el-option label="激活" :value="1"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
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
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </el-main>
    <el-dialog title="课程编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="course" ref="form" :rules="rules" status-icon>
        <el-form-item label="课程" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="course.name"
            autocomplete="off"
            placeholder="请输入课程"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="英文名称"
          prop="nameEn"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="course.nameEn"
            autocomplete="off"
            placeholder="请输入课程英文名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程编号"
          prop="courseNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="course.courseNo"
            autocomplete="off"
            placeholder="请输入课程编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门专业" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="departId">
              <el-select
                v-model="course.depart"
                placeholder="请选择学院"
                @change="selectDepart"
              >
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.departName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="majorId">
              <el-select v-model="course.major" placeholder="请选择专业">
                <el-option
                  v-for="item in majors"
                  :key="item.id"
                  :label="item.majorName"
                  :value="item.majorName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="课程状态" :label-width="formLabelWidth">
          <el-form-item prop="state">
            <el-select v-model="course.state" placeholder="请选择课程状态">
              <el-option label="未激活" :value="0"> </el-option>
              <el-option label="激活" :value="1"> </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
          :label-width="formLabelWidth"
        >
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="course.description"
              ref="md"
            />
          </client-only>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">编辑</el-button>
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
      sch: {},
      handbook: "",
      dialogFormVisible: false,
      span: 8,
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
      schools: [],
      departs: [],
      majors: [],
      courses: [],
      course: {
        id: 0,
        name: "",
        nameEn: "",
        courseNo: "",
        school: "",
        depart: "",
        major: "",
        state: 1,
        description: "",
        school:""
      },
      rules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        courseNo: [{ required: true, message: "必填项", trigger: "blur" }],
        depart: [{ required: true, message: "必填项", trigger: "blur" }],
        major: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption", "school"]),
  },
  created() {
    if (process.client) {
      this.sch = this.school;
      this.getCoursesPage(this.school.schoolName, 1);
      this.getDeparts(this.school.id);
      this.getMajors(this.school.id);
    }
  },
  methods: {
    getDeparts(schoolId) {
      this.$axios({
        url: "/api/department/getDepartsForSelectBySchoolId",
        params: {
          schoolId: schoolId,
        },
      })
        .then((res) => {
          if (res.success) {
            this.departs = res.data.departments;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogFormVisible = false;
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
    getMajors(schoolId) {
      this.$axios({
        url: "/api/major/getMajorsForSelectBySchoolId",
        params: {
          schoolId: schoolId,
        },
      })
        .then((res) => {
          if (res.success) {
            this.majors = res.data.majors;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogFormVisible = false;
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
    selectDepart(depart) {
      this.$axios({
        url: "/api/major/getMajorsForSelectByDepart",
        params: {
          depart: depart,
        },
      })
        .then((res) => {
          if (res.success) {
            this.majors = res.data.majors;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogFormVisible = false;
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
    getCoursesPage(school, current) {
      this.$axios({
        url: "/api/course/page/school",
        params: {
          school: school,
          current: current,
          size: 10,
        },
      })
        .then((res) => {
          if (res.success) {
            let page = res.data.page;
            this.courses = page.records;
            this.page = page;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogFormVisible = false;
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
    getCourse(id) {
      this.$axios({
        url: "/api/course/one",
        method: "get",
        params: {
          id: id,
        },
      })
        .then((res) => {
          if (res.success) {
            this.course = res.data.course;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            this.dialogFormVisible = false;
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
    toAdd() {
      let course = {
        id: 0,
        name: "",
        nameEn: "",
        courseNo: "",
        school: "",
        depart: "",
        major: "",
        school:"",
        state: 1,
      };
      this.course = course;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      
      this.getCourse(id);
    },
    del(id) {},
    handleCurrentChange(current) {
      this.page.current = current;
      this.getCoursesPage(this.school.schoolName, current);
    },
    submitForm(formName) {
       this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.course.school=this.school.schoolName;
            if(this.course.id==0){
              this.addCourse(this.course);
            }
            else{
              this.editCourse(this.course);
            }
          
          } else {
            this.$message.error("输入参数无效")
            return false;
          }
        });
    },
    async addCourse(course){
      let res=await this.$axios({
        url:'api/course/add',
        method:'post',
        data:course
      })
      if(res.success){
        this.getCoursesPage(this.school.schoolName);
        this.$message.success(res.msg);
      }
      else{
        this.$message.error(res.msg);
        return false;
      }

    },
    async editCourse(course){
      let res=await this.$axios({
        url:'api/course/edit',
        method:'post',
        data:course
      })
      if(res.success){
        this.getCoursesPage(this.school.schoolName);
        this.$message.success(res.msg);
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    }
  },
  watch: {
    "course.description": {
      handler(newDesc, oldDesc) {
        if (newDesc === null) {
          this.course.description = "";
        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>