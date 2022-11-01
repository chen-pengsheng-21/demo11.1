<template>
  <div class="jqr-main">
    <div class="interview">
      <el-card shadow="hover">
        <div class="header">
          <div class="title">
            <div class="space"></div>
            <div>{{ interview.title }}</div>
          </div>

          <div class="body">
            <div v-if="open" v-html="interview.analysis"></div>
            <el-divider @click="toggle"
              >面试题解析<i :class="icon"></i
            ></el-divider>
          </div>
          <div class="bottom">
            <el-tag type="success">{{ interview.interviewTypeName }}</el-tag>
            <span class="icons">
              <el-badge :value="interview.view" class="item" type="info">
                <i class="el-icon-view"></i>
              </el-badge>

              <el-badge :value="3" class="item" type="danger">
                <i class="el-icon-star-off"></i>
              </el-badge>
            </span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="interview-remark">
      <el-form :model="interviewRemark" ref="form" size="normal">
        <el-form-item prop="content">
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="interviewRemark.content"
              ref="md"
            />
          </client-only>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')"
            >提交解析</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="remarks">
      <div class="remark" v-for="item in interviewRemarks" :key="item.id">
        <div class="bar">
          <span class="createTime">{{ item.createTime | dateFormat }}</span>
          <span class="userName">{{ item.userName }}</span>
          
        </div>
        <div class="content" v-html="item.content"></div>
      </div>
      <el-empty :image-size="50" description="没人回答"></el-empty>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "index",
  data() {
    return {
      interview: {},
      open: false,
      handbook: "面试题解析",
      icon: "el-icon-arrow-down",
      interviewRemarks: [],
      interviewRemark: {
        id: 0,
        content: "",
        interviewId: 0,
        userId: 0,
      },
      remarkInterview: {
        id: 0,
        userName: "",
        content: "",
        createTime: "",
      },

      page: {
        current: 1,
        size: 10,
        total: 10,
      },

      interviewId: 0,
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption"]),
  },
  validate({ query }) {
    return /^\d+$/.test(parseInt(query.id));
  },
  created() {
    if (process.client) {
      let { id } = this.$route.query;
      this.interviewId = id;
      this.$nextTick(() => {
        this.getInterview(id);
        this.getInterviewRemarkPage(this.interviewId, this.page.current);
      });
    }
  },

  methods: {
    async getInterview(id) {
      let res = await this.$axios({
        url: "api/interview/getInterviewWithTypeNameVOById",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.interview = res.data.interviewWithTypeNameVO;
      } else {
        this.$router.push({
          path: "/static/interview",
        });
        return false;
      }
    },
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.icon = "el-icon-arrow-up";
      } else {
        this.icon = "el-icon-arrow-down";
      }
    },
    async getInterviewRemarkPage(interviewId, current) {
      let page = {
        current: current,
        size: 10,
        interviewId: interviewId,
      };
      let res = await this.$axios({
        url: "api/interviewRemark/remarkInterviewVoPage",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.interviewRemarks = page.records;
        console.log(this.interviewRemarks)
      } else {
        return false;
      }
    },
    async addInterviewRemark(remark) {
      let res = await this.$axios({
        url: "api/interviewRemark/add",
        method: "post",
        data: remark,
      });
      if (res.success) {
        this.remarkInterview=remark;
        this.remarkInterview.createTime=new Date();
        this.remarkInterview.userName=this.userinfo.userName;
        this.interviewRemarks.unshift(this.remarkInterview);
        let interviewRemark = {
          id: 0,
          content: "",
          interviewId: 0,
          userId: 0,
        };
        this.interviewRemark = interviewRemark;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    submitForm(formName) {
      if(this.interviewRemark.content==''){
        this.$message.error('解析内容不能为空');
        return false;
      }
      this.interviewRemark.interviewId = this.interviewId;
      this.interviewRemark.userId = this.userinfo.id;
      this.addInterviewRemark(this.interviewRemark);
    },
  },
  filters: {
    dateFormat(value) {
      return dayjs(value).format("YYYY-MM-DD hh:mm:ss");
    },
  },
};
</script>

<style scoped>
.interview .title {
  display: flex;
  align-items: center;
}
.header:hover .title {
  color: rgb(146, 231, 231);
}
.space {
  width: 10px;
  background-color: rgb(146, 231, 231);
  height: 20px;
  margin: 0 5px;
}
.body {
  margin: 20px 0;
  padding: 0 10px;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
}
.icons .item {
  margin: 0 40px;
}
.icons i {
  font-size: 24px;
  color: #ccc;
}
.interview-remark {
  margin-top: 20px;
}

.remark{
  background-color: #eee;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border-radius: 10px 10px 0 0;
  border: 1px solid #DCDFE6;
}
.remark .bar{
  height: 50px;
  display: flex;
  align-items:center;
  justify-content: space-between;
  border-bottom: 1px solid #E4E7ED;
 

}
.remark .bar .userName{
  margin-right: 10px;
  background-color: #409EFF;
  color: white;
  padding: 10px;
}
.remark .bar .createTime{
  margin-left: 10px;
  color: #409EFF;
}
.remark .content{
  min-height: 60px;
  background-color: white;
}

</style>