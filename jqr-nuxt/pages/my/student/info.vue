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
            ><a href="/my/student/info">个人信息</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ student?student.studentName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <el-tabs type="border-card">
        <el-tab-pane label="个人信息">
          <el-form :model="user" ref="userForm" :rules="ruleUsers" status-icon>
            <el-form-item
              label="专业"
              prop="userName"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="user.userName"
                autocomplete="off"
                placeholder="请输入专业"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="类型"
              prop="userType"
              :label-width="formLabelWidth"
            >
              <el-select v-model="user.userType" placeholder="请选择">
                <el-option label="学生" value="学生"> </el-option>
                <el-option label="教师" value="教师"> </el-option>
                <el-option label="教辅" value="教辅"> </el-option>
                <el-option label="管理员" value="管理员"> </el-option>
                <el-option label="后勤" value="后勤"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="绑定"
              prop="binding"
              :label-width="formLabelWidth"
            >
              <el-select v-model="user.binding" placeholder="请选择">
                <el-option label="未绑定" :value="0"> </el-option>
                <el-option label="绑定" :value="1"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="状态"
              prop="state"
              :label-width="formLabelWidth"
            >
              <el-select v-model="user.state" placeholder="请选择">
                <el-option label="未激活" :value="0"> </el-option>
                <el-option label="激活" :value="1"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitUserForm('form')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="学生信息">
          <el-form
            :model="studentInfo"
            ref="studentForm"
            :rules="ruleStudents"
            status-icon
          >
            <el-form-item label="部门专业" :label-width="formLabelWidth">
              <el-col :span="span">
                <el-form-item prop="departName">
                  <el-select
                    v-model="studentInfo.depart"
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
                <el-form-item prop="major">
                  <el-select
                    v-model="studentInfo.major"
                    placeholder="请选择专业"
                  >
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
              <el-col :span="span">
                <el-form-item prop="classinfo">
                  <el-select
                    v-model="studentInfo.classinfo"
                    placeholder="请选择班级"
                  >
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
                v-model="studentInfo.studentName"
                autocomplete="off"
                placeholder="请输入教师真实姓名"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="学号"
              prop="studentNo"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="studentInfo.studentNo"
                autocomplete="off"
                placeholder="请输入教师工号"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitTeacherForm('form')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "my",
  data() {
    return {
      span: 6,
      studentInfo: {},
      user: {},
      formLabelWidth: "100px",
      departs: [],
      majors: [],
      classinfos:[],
      ruleUsers:{},
      ruleStudents:{},
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "student"]),
  },
  created() {
    if (process.client) {
      this.$nextTick(() => {
        this.user = this.$lodash.cloneDeep(this.userinfo);
        this.studentInfo = this.$lodash.cloneDeep(this.student);
      });

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
  },
  filters: {
    dateFormat(value) {
      return dayjs(value).format("YYYY-MM-DD");
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #eee;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-radius: 5px;
}
.header-user {
  display: flex;
  align-items: center;
}
.header-user .username {
  padding-right: 10px;
}
.header-user .img {
  height: 30px;
  width: 30px;
}
</style>