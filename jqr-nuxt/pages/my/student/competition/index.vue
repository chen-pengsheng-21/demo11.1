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
            ><a href="/my/student/competition">我的竞赛</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ student?student.studentName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName:'' }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="competition-list">
        <el-tabs type="card"  v-model="activeName">
          <el-tab-pane label="我的赛事" name="first">
            <el-card
              class="competition-card"
              v-for="competition in competitions"
              :key="competition.id"
            >
              <div slot="header" class="clearfix">
                <span>{{ competition.title }}</span>
                <el-button-group style="float: right">
                  <el-button
                    type="default"
                    size="mini"
                    @click="toDetail(competition.id)"
                    >详情</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >通知</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >评论</el-button
                  >
                </el-button-group>
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
            <div v-if="competitions.length == 0" slot="empty">
              <el-empty :image-size="100"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="运行中" name="second">
            <el-card
              class="competition-card"
              v-for="competition in competitions1"
              :key="competition.id"
            >
              <div slot="header" class="clearfix">
                <span>{{ competition.title }}</span>
                <el-button-group style="float: right">
                  <el-button
                    type="default"
                    size="mini"
                    @click="toDetail(competition.id)"
                    >详情</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >通知</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >评论</el-button
                  >
                </el-button-group>
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
            <div v-if="competitions1.length == 0" slot="empty">
              <el-empty :image-size="100"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="结束的" name="third">
            <el-card
              class="competition-card"
              v-for="competition in competitions2"
              :key="competition.id"
            >
              <div slot="header" class="clearfix">
                <span>{{ competition.title }}</span>
                <el-button-group style="float: right">
                  <el-button
                    type="default"
                    size="mini"
                    @click="toDetail(competition.id)"
                    >详情</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >通知</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="toNote(competition.id)"
                    >评论</el-button
                  >
                </el-button-group>
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
            <div v-if="competitions2.length == 0" slot="empty">
              <el-empty :image-size="100"></el-empty>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
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
      competitions: [],
      competitions1: [],
      competitions2: [],
      activeName:'first'
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "student"]),
  },
  created() {
    if (process.client) {
      this.studentTakeInCompetitions(this.userinfo.id);
      this.getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool(
        this.school.id
      );
    }
  },

  methods: {
    async toDetail(id) {
      this.dialogCompetitionVisible = true;
    },
    async studentTakeInCompetitions(userId) {
      let res = await this.$axios({
        url: "api/competitionSignup/studentTakeInCompetitions",
        params: {
          userId: userId,
        },
      });
      if (res.success) {
        this.competitions = res.data.teacherCompetitionVos;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool(schoolId) {
      let res = await this.$axios({
        url: "api/competitionCreate/getTeacherCreateCompetitionsByStateNotEqualZeroAndSchool",
        params:{
           schoolId: schoolId,
        }
       
      });
      if (res.success) {
        let competitions = res.data.teacherCompetitionVos;
        this.competitions1 = competitions.filter((c) => {
          return s.state == 1;
        });
        this.competitions2 = competitions.filter((c) => {
          return s.state == 2;
        });
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
.competition-list {
}
.competition-list .bottom {
  display: flex;
  justify-content: space-between;
}
.competition-teacher {
  display: flex;
  align-items: center;
  height: 50px;
}
.competition-aim {
  height: 50px;
  line-height: 50px;
}
</style>