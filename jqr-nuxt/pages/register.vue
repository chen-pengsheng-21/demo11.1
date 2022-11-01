<template>
  <div class="register-box">
    <div class="register">
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
            suffix-icon="el-icon-user-solid"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userinfo.password"
            placeholder="请输入你的密码"
            suffix-icon="el-icon-star-on"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            v-model="userinfo.repassword"
            placeholder="请确认你的密码"
            suffix-icon="el-icon-star-on"
            autocomplete="off"
          ></el-input>
        </el-form-item>
    
        <client-only>
          <el-form-item>
            <slide-verify
              :l="42"
              :r="10"
              :w="310"
              :h="155"
              @success="onSuccess"
              @fail="onFail"
            ref="slideblock" 
             @refresh="onRefresh"
              slider-text="向右滑动"
              :imgs="imgs"

            ></slide-verify>
          </el-form-item>
        </client-only>
        <el-form-item>
          <el-button
            class="submitForm"
            type="primary"
            @click="submitForm('ruleForm')"
            >用户注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: "index",
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userinfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      verify: false, //滑动验证
      imgs:['/255.jpg','807.jpg','55.jpg'],
      span: 12,
      userinfo: {
        userName: "",
        password: "",
        repassword: "",
      },
      rules: {
        userName: [
          { required: true, message: "必填项", trigger: "blur" },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{7,32}$/,
            message: "字母开头，允许8-32字节，允许字母数字下划线",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "必填项", trigger: "blur" },
          {
            min: 8,
            max: 100,
            message: "用户账号不得少于8个字符",
            trigger: "blur",
          },
        ],
        repassword: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    onSuccess() {
      this.verify=true;
       this.$message.success("滑动验证成功")
    },
    onFail(){
      this.verify=false;
      this.$message.error("滑动验证错误，请重试")
    },
    onRefresh(){
      this.verify=false;
       this.$refs.slideblock.reset();
    },
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.verify) {
            this.$message.error("请进行滑动验证");
            return;
          }

          that

            .$axios({
              url: "/api/userinfo/register",
              method: "post",
              data: that.userinfo,
              params:{
                userName:this.userinfo.userName,
                password:this.userinfo.password,

              }
            })
            .then((res) => {
              if (res.success) {
                that.$router.push({ name: "login" });
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
  },
};
</script>

<style>
.register-box {
  width: 100%;
  height: calc(100% - 60px);
}
.register {
  position: absolute;
  top: 100px;
  right: 200px;
  width: 300px;
}
.submitForm {
  width: 100%;
}
</style>