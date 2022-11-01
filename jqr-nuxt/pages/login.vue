<template>
  <div class="login-box">
    <div class="login">
      <el-form
        :model="userinfo"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="0"
      >
        <el-form-item prop="userName">
          <el-input
            type="text"
            v-model="userinfo.userName"
            placeholder="请输入你的账号"
            suffix-icon="el-icon-lock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userinfo.password"
            placeholder="请输入你的密码"
            suffix-icon="el-icon-lock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-button
              class="submitForm"
              type="primary"
              @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12">
            <el-button class="submitForm" type="warning" @click="toRegister"
              >注册</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "index",
  data() {
    return {
      userinfo: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [{ required: true, message: "必填项", trigger: "blur" }],
        password: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapMutations([
      "setUserinfo",
      "setToken",
      "setMenus",
      "setStudent",
      "setTeacher",
    ]),
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that
            .$axios({
              url: "/api/userinfo/login",
              method: "post",
              data: this.userinfo,
            })
            .then((res) => {
              if (res.success) {
                let userinfo = res.data.userinfo;
                //判断用户是否绑定

                that.$store.commit("setUserinfo", userinfo);
                that.$store.commit("setToken", userinfo.token);
                that.$store.commit("setMenus", userinfo.secondLevelMenuVos);
                if (userinfo.binding == 1 && userinfo.userType == "学生") {
                  //保存学生信息
                  this.getStudentByUserId(userinfo.id);
                }
                if (
                  userinfo.binding == 1 &&
                  (userinfo.userType == "教师" || userinfo.userType == "教辅")
                ) {
                  //保存教师或者教辅
                  this.getTeacherByUserId(userinfo.id);
                }
                that.$router.replace({ name: "index" });
              } else {
                that.$message({
                  message: res.msg,
                  center: true,
                });
                return false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    toRegister() {
      this.$router.push("/register");
    },
    async getStudentByUserId(userId) {
      let res = await this.$axios({
        url: "api/student/getStudentByUserId",
        params: {
          userId: userId,
        },
      });
      if (res.success) {
        let student = res.data.student;
        this.setStudent(student);
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async getTeacherByUserId(userId) {
      let res = await this.$axios({
        url: "api/teacher/getTeacherByUserId",
        params: {
          userId: userId,
        },
      });
      if (res.success) {
        let teacher = res.data.teacher;
        this.setTeacher(teacher);
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
  },
};
</script>

<style scoped>
.login-box {
  width: 100%;
  height: calc(100% - 60px);
}
.login {
  position: absolute;
  top: 200px;
  right: 200px;
  width: 300px;
}
.submitForm {
  width: 100%;
}
</style>