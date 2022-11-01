<template>
  <div class="login">
    <el-page-header @back="back"> </el-page-header>
    <div class="login-logo">
      <img :src="logo" alt="logo" title="logo" />
    </div>
    <div class="login-body">
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
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="submitForm('ruleForm')"
            >用户登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="login-bar">
      <el-link type="info" href="/register">用户注册</el-link>
      <el-link type="info" href="/forgetpassword">忘记密码</el-link>
    </div>
  </div>
</template>

<script>
import ai from "@/assets/ai.png";
import { post } from "@/utils/request.js";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      logo: ai,
      size: 200,
      user: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          {
            type: "string",
            required: true,
            message: "必填项",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["$preRoute"]),
  },
  methods: {
    ...mapMutations(["setToken", "setUserInfo"]),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //实现登录
          // post('api/user/login',this.user).then(res=>{
          //     console.log(res)
          //     //登陆成功进行
          //     //保存用户状态
          //     //跳转到某个页面

          // }).catch(err=>{
          //   console.log(err)
          // })
          // baseurl+URL

          let result = await post("api/user/login", this.user);
          //console.log(result)
          if (result.code == 1) {
            //登陆成功进行
            ///保存用户状态
            this.setToken(result.user.token);
            //保存用户信息
            this.setUserInfo(result.user);
            //     //跳转到某个页面
            this.$router.push("/");
          } else {
            this.$message({
              showClose: true,
              message: result.msg,
              type: "error",
            });
            return;
          }
        } else {
          console.log("error submit!!");
          return false; //默认行为不能执行
        }
      });
    },
    back() {
      console.log(this.$router);
      this.$router.push(this.$preRoute);
    },
  },
};
</script>

<style scoped>
.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.login-bar {
  display: flex;
  justify-content: space-around;
}
</style>