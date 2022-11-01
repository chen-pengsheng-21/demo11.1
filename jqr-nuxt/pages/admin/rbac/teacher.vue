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
            ><a href="/admin/rbac/teacher">教师管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo?userinfo.userName:'' }}</div>
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
          >导入教师信息</el-button
        >
      </div>
      <el-table :data="teachers" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="depart" label="部门" width="200">
        </el-table-column>
        <el-table-column prop="teacherName" label="姓名"> </el-table-column>
        <el-table-column prop="teacherNo" label="工号" width="100">
        </el-table-column>
        <el-table-column prop="professional" label="职称" width="100">
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
    <el-dialog title="教师编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="teacher" ref="form" :rules="rules" status-icon>
        <el-form-item
          prop="departId"
          label="部门"
          :label-width="formLabelWidth"
        >
          <el-select v-model="teacher.depart" placeholder="请选择部门">
            <el-option
              v-for="item in departs"
              :key="item.id"
              :label="item.departName"
              :value="item.departName"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="teacherName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="teacher.teacherName"
            autocomplete="off"
            placeholder="请输入教师真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="工号"
          prop="teacherNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="teacher.teacherNo"
            autocomplete="off"
            placeholder="请输入教师工号"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="职称"
          prop="professional"
          :label-width="formLabelWidth"
        >
          <el-select v-model="teacher.professional" placeholder="请选择">
            <el-option label="助教" value="助教"> </el-option>
            <el-option label="讲师" value="讲师"> </el-option>
            <el-option label="副教授" value="副教授"> </el-option>
            <el-option label="教授" value="教授"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="教师信息导入"
      width="40%"
      :visible.sync="dialogImportTeacherVisible"
    >
      <w-excel-teacher></w-excel-teacher>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import wExcelTeacher from "~/components/w-excel-teacher.vue";
export default {
  layout: "my",
  data() {
    return {
      userName: "",
      userType: "",
      dialogFormVisible: false,
      dialogImportTeacherVisible: false,
      formLabelWidth: "100px",
      disabled: false,
      sch: {},
      page: {
        current: 0,
        size: 0,
        total: 0,
      },
      departs: [],
      majors: [],
      teachers: [],
      teacher: {
        id: 0,
        teacherName: "",
        teacherNo: "",
        school: "",
        depart: "",
        professional: "",
      },
      rules: {
        teacherName: [{ required: true, message: "必填项", trigger: "blur" }],
        teacherNo: [{ required: true, message: "必填项", trigger: "blur" }],
        depart: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  components: {
    wExcelTeacher,
  },
  created() {
    if (process.client) {

      this.sch = this.school;
      this.getDeaprtsBySchoolId(this.school.id);
      this.getTeachersPageBySchoolName(this.school.schoolName, 1);
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

    async getTeachersPageBySchoolName(name, current) {
      let res = await this.$axios({
        url: "/api/teacher/page/school",
        params: {
          current: current,
          schoolName: name,
          size: 10,
        },
      });
      if (res.success) {
        let page = res.data.page;
        this.teachers = page.records;
        this.page = page;
      } else {
        this.$message.error(res.msg);
      }
    },
    async getTeacher(id) {
      let res = await this.$axios({
        url: "/api/teacher/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.teacher = res.data.teacher;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    handleCurrentChange(current) {
      this.getTeachersPageBySchoolName(this.school.schoolName, current);
    },
    toAdd() {
      this.disabled = false;
      let teacher = {
        id: 0,
        teacherName: "",
        teacherNo: "",
        school: "",
        depart: "",
        professional: "",
      };
      this.teacher = teacher;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.disabled = true;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getTeacher(id);
    },
    del(id) {},
    toImportExcel() {
      this.dialogImportTeacherVisible = !this.dialogImportTeacherVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.teacher.id == 0) {
            this.teacher.school=this.school.schoolName;
            this.$axios({
              url: "/api/teacher/add",
              method: "post",
              data: this.teacher,
            })
              .then((res) => {
                if (res.success) {
                  this.getTeachersPageBySchoolName(
                    this.school.schoolName,
                    this.page.current
                  );
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
              url: "/api/teacher/edit",
              method: "post",
              data: this.teacher,
            })
              .then((res) => {
                if (res.success) {
                  this.getTeachersPageBySchoolName(
                    this.school.schoolName,
                    this.page.current
                  );
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
  },
};
</script>

<style scoped>
</style>