<template>
  <div class="jqr-main">
    <div class="competition-list">
          <el-card
            class="competition-card"
            v-for="competition in competitions"
            :key="competition.id"
          >
            <div slot="header" class="clearfix">
              <span>{{ competition.title }}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="toDetail(competition.id)"
                >报名</el-button
              >
            </div>
            <div class="bottom clearfix">
              <div class="competition-time-teacher">
                <div class="competition-time">
                  <span>赛事周期:</span>
                  <el-tag class="time">{{
                    competition.startTime | dateFormat
                  }}</el-tag>
                  <el-tag class="time">{{
                    competition.endTime | dateFormat
                  }}</el-tag>
                </div>
                <div class="competition-teacher">
                  <span class="teacher">赛事负责人：</span>
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item>{{
                      competition.teacher.depart
                    }}</el-breadcrumb-item>
                    <el-breadcrumb-item
                      ><a href="#">{{
                        competition.teacher.teacherName
                      }}</a></el-breadcrumb-item
                    >
                  </el-breadcrumb>
                </div>
              </div>
              <div class="competition-target-aim">
                <div class="competition-target">
                  <span class="">竞赛对象:</span>
                  <el-tag>{{ competition.target }}</el-tag>
                </div>
                <div class="competition-aim">
                  <span class="">目标赛事:</span>
                  <el-tag>{{ competition.aimCompetitionName }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "index",
  name:"static-competition",
  data() {
    return {
      dialogCompetitionVisible: false,
      activeName: "first",
      competitions: [],
      runingCompetitions: [],
      finishedCompetitions: [],
      competition: {},
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "teacher"]),
  },
  created() {
    if (process.client) {
      this.getSignUpedCompetitionCreatesBySchoolId(this.school.id);
      this.getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool(
        this.school.id
      );
    }
  },

  methods: {
    async toDetail(id) {
      this.$router.push({
        path:'/static/competition/detail',
        query:{
          id:id
        }
      })
    },
    async getSignUpedCompetitionCreatesBySchoolId(schoolId) {
      let res = await this.$axios({
        url: "api/competitionCreate/getSignUpedCompetitionCreate",
        params: {
          schoolId: schoolId,
        },
      });
      if (res.success) {
        console.log(res)
        this.competitions = res.data.teacherCompetitionVos;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool(schoolId) {
      let res = await this.$axios({
        url: "api/competitionCreate/getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool",
        params: {
          schoolId: schoolId,
        },
      });
      if (res.success) {
        let competitions = res.data.teacherCompetitionVos;
      } 
    },

    handleClick(tab, event) {
      console.log(tab, event);
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
.competition-list {
}
.competition-list .bottom {
  display: flex;
  justify-content: space-between;
}
.competition-teacher{
  display: flex;
  align-items: center;
  height: 50px;
}
.competition-aim{
  height: 50px;
  line-height: 50px;
}
</style>