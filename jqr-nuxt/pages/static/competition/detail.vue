<template>
  <div class="jqr-main">
    <div class="competition">
      <el-descriptions :title="competition.title" :column="2">
        <el-descriptions-item label="赛事负责人">
          <el-tag>{{competition.teacher ? competition.teacher.teacherName : "" }}</el-tag>
          <el-tag type="success">{{competition.teacher ? competition.teacher.depart : ""}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="赛事目标">{{ competition.target }}</el-descriptions-item>
        <el-descriptions-item label="赛事周期">{{ competition.startTime | dateFormat }}--{{ competition.endTime | dateFormat }}</el-descriptions-item>
      
        <el-descriptions-item label="对标赛事"
          >{{ competition.aimCompetitionName }}</el-descriptions-item
        >
      </el-descriptions>
    
    <el-divider content-position="right">赛事方案</el-divider>
    <div v-html="competition.content"></div>
    <el-button type="primary" :disabled="signuped" @click="sugnupCompetition(competition.id)"
      >报名</el-button
    >
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
      dialogCompetitionVisible: false,
      competitions: [],
      competition: {},
      signuped:false,
    };
  },
  computed: {
    ...mapState(["userinfo"]),
  },
  validate({ query }) {
    return /^\d+$/.test(parseInt(query.id));
  },
  created() {
    if (process.client) {
      let { id } = this.$route.query;
      this.$nextTick(() => {
        this.getTeacherCompetitionVoById(id);
        this.signupedCompetitionCreate(this.userinfo.id,id);
      });
    }
  },

  methods: {
    async getTeacherCompetitionVoById(id) {
      let res = await this.$axios({
        url: "api/competitionCreate/getTeacherCompetitionVoById",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.competition = res.data.checkCompetitionVo;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async sugnupCompetition(id){
      if(this.userinfo.userType!='学生'){
        this.$message.error("对不起，此赛事只对学生开放")
        return false;
      }
      let competitionSignup={
        studentId:this.userinfo.id,
        competitionId:id,
        checked:0

      }
      let res=await this.$axios({
        url:'api/competitionSignup/add',
        method:'post',
        data:competitionSignup
      });
      if(res.success){
         this.$message.success(res.msg); 
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    //判断是否已经报名
    async signupedCompetitionCreate(userId,competitionId){
      let res=await this.$axios({
        url:'api/competitionSignup/signupedCompetitionCreate',
        params:{
          userId:userId,
          competitionId:competitionId,
        }
      })
      if(res.success){
        this.signuped=true;
        this.getTeacherCompetitionVoById(competitionId);
      }
      else{
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
.doc-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #eee;
}
.quill-editor {
  min-height: 200px;
}
.competition-list {
  margin-top: 10px;
}
.competition-list .bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.competition .item {
  margin-top: 10px;
}
</style>