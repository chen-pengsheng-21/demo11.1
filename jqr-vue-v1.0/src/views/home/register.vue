<template>
  <div class="register">
    <el-page-header @back="back"> </el-page-header>
    <div class="register-logo">
      <img :src="logo" alt="logo" title="logo" />
    </div>
    <div class="register-body">
      <el-form
        :model="user"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="userName">
          <el-input
            type="text"
            v-model="user.userName"
            placeholder="请输入你的账号"
            suffix-icon="el-icon-message"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="user.password"
            placeholder="请输入你的密码"
            suffix-icon="el-icon-lock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            v-model="user.repassword"
            placeholder="请确认你的密码"
            suffix-icon="el-icon-lock"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="submitForm('ruleForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ai from "@/assets/ai.png";
import { post } from "@/utils/request.js";
import {mapState} from 'vuex'
export default {
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logo: ai,
      user: {
        userName: "",
        password: "",
        repassword: "",
      },
      rules: {
        email: [
          {
            type: "string",
            required: true,
            message: "请输入你的账号",
            trigger: "blur",
          },
          { min: 8, max: 32, message: "字符串数量在8-32之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 32,
            message: "密码长度数量在8-32之间",
            trigger: "blur",
          },
        ],
        repassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  computed:{
    ...mapState(['$preRoute'])
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
         // alert("submit!");
          //注册接口
          // http://api.qzimp.cn/api/user/register
          //loadding
          let { userName, password } = this.user; //解构赋值
          let params = { //构建数据 javascript 不严格json对象也能识别
            "userName": userName,
            "password": password,
          };
          // Promise().then.catch() 为了解决callback hell
          //服务器跨域访问 服务器处理
          //使用代理 
          post("api/user/register", params)
            .then((res) => {
              //成功
             // console.log(res);
        
              if (res.code == 1) {
                //代码
                //成功要跳转到登录页面
                this.$router.push("/login");
              } else {
                //反馈提的错误
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "error",
                });

                return;
              }
            })
            .catch((err) => {
              console.log(err);
            });

          //await async 成对出现

        //   let resukt = await post("api/user/register", params);
        //   if (resukt.code == 1) {
        //     //代码
        //     this.$router.push("/login");
        //   } else {
        //     this.$message({
        //       showClose: true,
        //       message: resukt.msg,
        //       type: "error",
        //     });

        //     return;
        //   }

        //   //注册既是登录？
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back(){
      this.$router.push(this.$preRoute);
    }
  },
};
</script>

<style scoped>
.register-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>