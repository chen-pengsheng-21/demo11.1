<template>
  <client-only>
    <div class="create-box">
      <el-header class="header">
        <div class="header-breadcrumb">
          <el-page-header
            @back="goBack"
            :content="interview.title | titleFilter"
          >
          </el-page-header>
        </div>
        <div class="header-user">
          <el-button
            type="primary"
            icon="el-icon-receiving"
            @click="saveInterview"
            >保存</el-button
          >
        </div>
      </el-header>
      <el-main class="main">
        <w-interview-type
          @getInterviewTypesAndIndex="getInterviewTypesAndIndex"
          :interviewTypes="interviewTypes"
          :currentIndex="currentIndex"
        ></w-interview-type>

        <el-input placeholder="请输入标题" v-model="interview.title" clearable>
        </el-input>

        <mavon-editor
          :toolbars="markdownOption"
          :placeholder="handbook"
          @change="changeMavon"
          @save="saveMavon"
          v-model="interview.analysis"
          ref="bj"
        />
      </el-main>
    </div>
  </client-only>
</template>

<script>
import wInterviewType from "@/components/w-interview-type.vue";
export default {
  layout: "my",
  data() {
    return {
      interview: {
        id: 0,
        title: "",
        analysis: "",
        interviewType: 0,
        userinfoId: 0,
      },
      interviewTypes: [],
      handbook: "### 黄金百战穿金甲，不破楼兰终不还",
      currentIndex: 8,
      userType:''
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.userinfo;
    },
    markdownOption() {
      return this.$store.state.markdownOption;
    },
  },
  components: {
    wInterviewType,
  },
  created() {
    this.userType=this.userinfo.userType;
    this.getInterviewTypes();
    let { id } = this.$route.query;
    if (id > 0) {
      this.getInterviewById(id);
    }
  },
  methods: {
    changeMavon() {
      this.interview.analysis = this.$refs.bj.d_value;
    },
    saveInterview() {
      this.interview.userinfoId = this.userinfo.id;
      let { title, interviewType, userinfoId } = this.interview;
      if (title.length == 0) {
        this.$message.error("笔记标题不能为空");
      }
      if (interviewType == 0) {
        this.$message.error("请先选择面试题类型");
      }
      if (userinfoId == 0) {
        this.$message.error("用户编号不能为空");
      }
      // console.log(this.interview);

      this.$axios({
        url: "api/interview/add",
        method: "post",
        data: this.interview,
      })
        .then((res) => {
          if (res.success) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.interview.analysis = "";
            this.interview.title = ""; //防止重复点击
            return;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    goBack() {
      this.$router.push("/my/interview");
    },
    saveMavon(value, render) {
      this.interview.analysis = value;
    },

    getInterviewTypes() {
      this.$axios({
        url: "api/interviewType/all",
        method: "get",
      })
        .then((res) => {
          if (res.success) {
            let interviewTypes = res.data.interviewTypes;
            this.interviewTypes = interviewTypes;
            this.interview.interviewType = interviewTypes[this.currentIndex].id;

            return;
          } else {
            this.$message.error(res.msg);
            return;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          return;
        });
    },
    getInterviewTypesAndIndex(obj) {
      let { index, interviewTypeId } = obj;
      this.currentIndex = index;
      this.interview.interviewType = interviewTypeId;
    },
    getInterviewById(id) {
      this.$axios({
        url: "api/interview/one?id=" + id,
        method: "get",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((res) => {
          if (res.success) {
            this.interview = res.data.interview;
            this.interviewTypes.find((value, index) => {
              if (value.id == this.interview.interviewType)
                this.currentIndex = index;
            });
          } else {
            this.$message.error(res.msg);
            return;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          return;
        });
    },
  },
  filters: {
    titleFilter(value) {
      if (value.length == 0) {
        return "未命名面试试题";
      }
      return value;
    },
  },
};
</script>

<style scoped>
.create-box {
  width: 100%;
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
.doc-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #eee;
}
.markdown-body {
  height: 800px !important;
}
</style>