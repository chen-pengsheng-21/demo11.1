<template>
  <div class="jqr-main">
    <div class="interview-list">
      <div
        class="interview"
        v-for="interview in interviews"
        :key="interview.id"
        @click="toDetail(interview.id)"
      >
        <div class="title">
          <div class="space"></div>
          <div>{{ interview.title }}</div>
        </div>
        <div class="toolbar">
          <el-tag type="info">{{ interview.interviewTypeName }}</el-tag>
          <span class="icons">
            <el-badge :value="interview.view" class="item" type="info">
              <i class="el-icon-view"></i>
            </el-badge>
            <el-badge :value="10" class="item" type="primary">
              <i class="el-icon-chat-dot-square"></i>
            </el-badge>
            <el-badge :value="3" class="item" type="danger">
              <i class="el-icon-star-off"></i>
            </el-badge>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "index",
  name:"static-interview",
  data() {
    return {
      interviews: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "teacher"]),
  },
  created() {
    if (process.client) {
      this.getInterviewWithTypeByPage(1);
    }
  },

  methods: {
    async toDetail(id) {
      this.$router.push({
        path: "/static/interview/detail",
        query: {
          id: id,
        },
      });
    },
    async getInterviewWithTypeByPage(current) {
      let page = {
        current: current,
        size: 10,
        colums: ["id", "title", "interview_type","view","update_time"],
      };
      let res = await this.$axios({
        url: "api/interview/getInterviewWithTypeByPage",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.interviews=page.records;
        
      } else {
        return false;
      }
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
.interview-list{
  margin-bottom: 100px;
}
.interview {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
}
.interview:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.interview .title {
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
}
.interview:hover .title {
  color: rgb(146, 231, 231);
}
.space {
  width: 10px;
  background-color: rgb(146, 231, 231);
  height: 20px;
  margin: 0 5px;
}
.toolbar {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.icons i{
    font-size: 24px;
    color: #ccc;
}
.icons .item {
  margin:0 40px;
}
</style>