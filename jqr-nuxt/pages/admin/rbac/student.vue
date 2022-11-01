<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{userinfo?userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/rbac/student">学生管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{userinfo?userinfo.username:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school? school.schoolName:'' }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
        <el-button type="danger" icon="el-icon-plus" @click="toImportExcel"
          >导入学生信息</el-button
        >
      </div>
      <el-table :data="students" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="100">
        </el-table-column>

        <el-table-column prop="depart" label="部门" width="200">
        </el-table-column>
        <el-table-column prop="major" label="专业" width="200">
        </el-table-column>
        <el-table-column prop="classinfo" label="班级" width="250">
        </el-table-column>
        <el-table-column prop="studentName" label="姓名"> </el-table-column>
        <el-table-column prop="studentNo" label="工号" width="200">
        </el-table-column>
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
    <el-dialog title="学生编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="student" ref="form" :rules="rules" status-icon>
        <el-form-item label="部门|专业|班级" :label-width="formLabelWidth">
          <el-col :span="6">
            <el-form-item prop="depart" label="部门">
              <el-select v-model="student.depart" placeholder="请选择部门">
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.departName"
                  @change="selectDepart(item.id)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="major" label="专业">
              <el-select v-model="student.major" placeholder="请选择专业">
                <el-option
                  v-for="item in majors"
                  :key="item.id"
                  :label="item.majorName"
                  :value="item.majorName"
                  @change="selectMajor(item.id)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="classinfo" label="班级">
              <el-select v-model="student.classinfo" placeholder="请选择班级">
                <el-option
                  v-for="item in classinfos"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="studentName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="student.studentName"
            autocomplete="off"
            placeholder="请输入学生真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="工号"
          prop="studentNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="student.studentNo"
            autocomplete="off"
            placeholder="请输入学生学号"
            :disabled="disabled"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="学生信息导入"
      width="40%"
      :visible.sync="dialogImportStudentVisible"
    >
      <w-excel-student></w-excel-student>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import wExcelStudent from "~/components/w-excel-student.vue";
export default {
  layout: "my",
  data() {
    return {
      disabled:false,
      dialogFormVisible: false,
      dialogImportStudentVisible: false,
      formLabelWidth: "120px",
      sch: {},
      departs: [],
      majors: [],
      classinfos: [],
      students: [],
      student: {
        id: 0,
        studentName: "",
        studentNo: "",
        school: "",
        depart: "",
        major: "",
        classinfo: "",
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      rules: {
        depart:[
          {required:true,message:'必填项',trigger:'blur'}

        ],
        major:[
          {required:true,message:'必填项',trigger:'blur'}
        ],

        classinfo:[
          {required:true,message:'必填项',trigger:'blur'}
        ],
        studentName:[
          {required:true,message:'必填项',trigger:'blur'}
        ],
        studentNo:[
          {required:true,message:'必填项',trigger:'blur'}
        ]
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  components: {
    wExcelStudent,
  },
  created() {
    if (process.client) {
  
      this.sch = this.school;
      this.getDeaprtsBySchoolId(this.school.id);
      this.getMajorsForSelectBySchoolId(this.school.id);
      this.getStudentsPageBySchool(this.school.schoolName, 1);
    }
  },
  methods: {
    getDeaprtsBySchoolId(schoolId) {
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
    getMajorsForSelectBySchoolId(schoolId) {
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
    async getMajorForSelectByDepartId(departId) {
      let res = await this.$axios({
        url: "/api/major/getMajorForSelectByDepartId",
        params: {
          departId: departId,
        },
      });
      if (res.success) {
        this.majors = res.data.majors;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getClassinfosForSelectByMajorId(majorId) {
      let res = await this.$axios({
        url: "/api/classinfo/getClassinfosForSelectByMajorId",
        params: {
          majorId: majorId,
        },
      });
      if (res.success) {
        this.classinfos = res.data.classinfos;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getStudentsPageBySchool(school, current) {
      let res = await this.$axios({
        url: "/api/student/page/school",
        params: {
          current: current,
          school: school,
          size: 10,
        },
      });
      if (res.success) {
        let page = res.data.page;
        this.students = page.records;
        this.page = page;
      } else {
        this.$$message.error(res.msg);
        return false;
      }
    },
    async getStudent(id) {
      let res = await this.$axios({
        url: "/api/student/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.student = res.data.student;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async addStudent(student) {

      let res = await this.$axios({
        url: "/api/student/add",
        method: "post",
        data: student,
      });
      if (res.success) {
        this.getStudentsPageBySchool(this.school.schoolName, this.page.current);
        this.$message.success(res.msg);
        this.dialogFormVisible = false;
      } else {
        this.$message.error(res.msg);
        this.dialogFormVisible = false;
      }
    },
    async editStudent(student) {
     
      let res = await this.$axios({
        url: "/api/student/edit",
        method: "post",
        data: student,
      });
      if (res.success) {
        this.getStudentsPageBySchool(this.school.schoolName, this.page.current);
        this.$message.success(res.msg);
        this.dialogFormVisible = false;
      } else {
        this.$message.error(res.msg);
        this.dialogFormVisible = false;
      }
    },
    handleCurrentChange(current) {
      this.page.current=current;
      this.getStudentsPageBySchool(this.school.schoolName, current);
    },
    toAdd() {
      this.disabled=false;
      let student = {
        id: 0,
        studentName: "",
        studentNo: "",
        school: "",
        depart: "",
        major: "",
        classinfo: "",
      };
      this.student = student;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
       this.disabled=true;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getStudent(id);
    },
    del(id) {},
    toImportExcel() {
      this.dialogImportStudentVisible = !this.dialogImportStudentVisible;
    },
    selectDepart(id) {
      this.getMajorForSelectByDepartId(id);
    },
    selectMajor(id) {
      this.getClassinfosForSelectByMajorId(id);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.teacher.id == 0) {
            this.student.school = this.school.schoolName;
            this.addStudent(this.student);
          } else {
            this.editStudent(this.student);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>