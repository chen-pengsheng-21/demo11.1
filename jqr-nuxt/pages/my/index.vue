<template>
  <div class="my-index">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/my">{{ userinfo ? userinfo.userType:''}}中心</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo ? userinfo.userName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
      </div>
    </el-header>
    <el-main class="main">
      <w-toolbar :toolbars="toolbars"></w-toolbar>
    </el-main>

    <el-dialog
      title="用户绑定"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
    >
      <el-form :model="user" ref="userForm" :rules="rules">
        <el-form-item
          label="用户类型"
          prop="userType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="user.userType" placeholder="请选择用户类型">
            <el-option label="学生" value="学生"></el-option>
            <el-option label="教师" value="教师"></el-option>
            <el-option label="教辅" value="教辅"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="studentNo"
          v-if="user.userType == '学生'"
          label="学号"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="user.studentNo"
            autocomplete="off"
            placeholder="请输入你的学号"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="teacherNo"
          v-else
          label="工号"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="user.teacherNo"
            autocomplete="off"
            placeholder="请输入你的工号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-button
              type="primary"
              style="width: 100%"
              @click="onSubmit('userForm')"
              >立即绑定</el-button
            >
          </el-col>
          <el-col :span="12"
            ><el-button style="width: 100%" type="info" @click="toIndex"
              >返回首页</el-button
            ></el-col
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import wToolbar from "../../components/w-toolbar.vue";
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  layout: "my",
  name: "index",
  data() {
    return {
      toolbars: {
        height: 100,
        width: 250,
      },
      userType: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      user: {
        userType: "学生",
        teacherNo: "",
        studentNo: "",
      },
      deepCloneUserinfo: {},
      rules: {
        teacherNo: [{ required: true, message: "必填项", trigger: "blur" }],
        studentNo: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      bindStudentData: {
        student: {},
        userinfo: {},
      },
      bindTeacherData: {
        teacher: {},
        userinfo: {},
      },
    };
  },
  components: {
    wToolbar,
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  created() {
    if (process.client) {
      this.userType = this.userinfo.userType;
      this.deepCloneUserinfo = this.$lodash.cloneDeep(this.userinfo);
      //$nextTick() 作用
      //在Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中
      //
      this.$nextTick(() => {
        if (this.deepCloneUserinfo.binding == 0) {
          this.dialogFormVisible = true;
        }
      });

    }
  },
  methods: {
    ...mapMutations(["setUserinfo", "setUserinfo", "setToken", "setMenus"]),
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let userinfo = this.$lodash.cloneDeep(this.userinfo);

          if (this.user.userType === "学生") {
            //编订学生
            userinfo.binding = 1;
            userinfo.userType = this.user.userType;
            let student = await this.getStudentByStudentNo(this.user.studentNo);
            if (!student) {
              return;
            }
            student.userId = userinfo.id;
            this.bindStudentData.student = student;
            this.bindStudentData.userinfo = userinfo;

            this.bindStudent(this.bindStudentData);

            //重新登录
          } else {
            //绑定教师，教辅
            userinfo.binding = 1;
            userinfo.userType = this.user.userType;
            let teacher = await this.getTeacherByTeacherNo(this.user.teacherNo);
            if (!teacher) {
              return false;
            }
            teacher.userId = userinfo.id;
            
            this.bindTeacherData.teacher = teacher;
            this.bindTeacherData.userinfo = userinfo;
            this.bindTeacher(this.bindTeacherData);
          }
        } else {
          this.$message.error("表单校验错误");
          return false;
        }
      });
    },
    async bindStudent(data) {
      let res = await this.$axios({
        url: "api/student/isStudentBind",
        method: "post",
        data: data,
      });
      if (res.success) {
        this.setUserinfo(undefined);
        this.setToken(undefined);
        this.setMenus(undefined);
        this.$router.push("/login");
      } else {
        this.$message.error(res.msg);
      }
    },
    async getStudentByStudentNo(studentNo) {
      let res = await this.$axios({
        url: "api/student/getStudentByStudentNo",
        params: {
          studentNo: studentNo,
        },
      });
      if (res.success) {
        let student = res.data.student;
        if (student.userId > 0) {
          this.$message.error("信息已绑定，联系管理员");
          return;
        } else {
          return student;
        }
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async getTeacherByTeacherNo(teacherNo) {
      let res = await this.$axios({
        url: "api/teacher/getTeacherByTeacherNo",
        params: {
          teacherNo: teacherNo,
        },
      });
      if (res.success) {
        let teacher = res.data.teacher;
        //判断信息是否已绑定
        if (teacher.userId > 0) {
          this.$message.error("信息已绑定，联系管理员");
          return;
        } else {
          return teacher;
        }
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async bindTeacher(data) {
      let res = await this.$axios({
        url: "api/teacher/isTeacherBind",
        method: "post",
        data: data,
      });
      if (res.success) {
        this.setUserinfo(undefined);
        this.setToken(undefined);
        this.setMenus(undefined);
        this.$router.push("/login");
      } else {
        this.$message.error(res.msg);
      }
    },
    toIndex() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.my-index {
  width: 100%;
}
.user {
  height: 100vh;
  border: 1px solid #eee;
  overflow: hidden;
}
.user-center {
  height: 100px;
  display: flex;

  align-items: center;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

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