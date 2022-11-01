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
            ><a href="/my/teacher/info">个人信息</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ teacher ? teacher.teacherName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <el-tabs type="border-card">
        <el-tab-pane label="个人信息">
          <el-form :model="user" ref="form" :rules="ruleUsers" status-icon>
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
        <el-tab-pane label="教师信息">
          <el-form
            :model="teacherInfo"
            ref="form"
            :rules="ruleTeachers"
            status-icon
          >
            <el-form-item
              prop="departId"
              label="部门"
              :label-width="formLabelWidth"
            >
              <el-select v-model="teacherInfo.depart" placeholder="请选择部门">
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
                v-model="teacherInfo.teacherName"
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
                v-model="teacherInfo.teacherNo"
                autocomplete="off"
                placeholder="请输入教师工号"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="职称"
              prop="professional"
              :label-width="formLabelWidth"
            >
              <el-select v-model="teacherInfo.professional" placeholder="请选择">
                <el-option label="助教" value="助教"> </el-option>
                <el-option label="讲师" value="讲师"> </el-option>
                <el-option label="副教授" value="副教授"> </el-option>
                <el-option label="教授" value="教授"> </el-option>
              </el-select>
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
      user: {
        id: 0,
        userName: "",
        userType: "",
        state: 1,
        binding: 0,
      },
      ruleUsers: {
        userName: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      teacherInfo: {
        id: 0,
        teacherName: "",
        teacherNo: "",
        school: "",
        depart: "",
        professional: "",
      },
      ruleTeachers: {
        teacherName: [{ required: true, message: "必填项", trigger: "blur" }],
        teacherNo: [{ required: true, message: "必填项", trigger: "blur" }],
        depart: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      departs:[],
      formLabelWidth:'100px'
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "teacher"]),
  },
  created() {
    if (process.client) {
      //this.sch=this.$lodash.cloneDeep(this.school) 深度拷贝
      this.$nextTick(()=>{
             this.user=this.$lodash.cloneDeep(this.userinfo)
              this.teacherInfo=this.$lodash.cloneDeep(this.teacher)
      })

      this.getDepartForSelect(this.school.id);
 
    }
  },

  methods: {
    submitTeacherForm(form) {},
    submitUserForm(form) {},
    async getDepartForSelect(schoolId){
      let res=await this.$axios({
        url:'api/department/getDepartsForSelectBySchoolId',
        params:{
          schoolId:schoolId
        }
      })
      if(res.success){
        this.departs=res.data.departments;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    }
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