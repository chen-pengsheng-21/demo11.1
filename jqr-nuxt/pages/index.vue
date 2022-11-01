<template>
  <div >
    <div class="ad-bg">
    <div class="ad">
      <el-carousel :interval="5000" arrow="always" type="card" height="300px" >
        <el-carousel-item v-for="item in ads" :key="item.id" @click.native="toJump(item.adHref)">
          <div class="adStyle"><span>{{ item.content }}</span></div> 
          <img :src="item.adUrl" fit="scale-down" :alt="item.content"   :width="item.width" :height="item.height" />
          
        </el-carousel-item>
      </el-carousel>
    </div>
    </div>
    <div class="jqr-main">
      <div class="conpetition-bar">
        <div>竞赛列表</div>
        <i class="el-icon-s-grid"></i>
      </div>
      <div class="competition-list">
        <div v-if="competitions.length == 0" slot="empty">
          <el-empty :image-size="100"></el-empty>
        </div>
        <el-card
          v-else
          class="competition-card"
          v-for="(competition, index) in competitions"
          :key="competition.id"
        >
          <template v-if="index == 0">
            <div slot="header" class="clearfix">
              <span>{{ competition.title }}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="toCompetition(competition.id)"
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
          </template>
          <template v-else>
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
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "index",
  name: "index",
  data() {
    return {
      ads: [],
      competitions: [],
      base:{
        backgroundColor:'red'
      }

    };
  },
  computed: {
    ...mapState(["school"]),
  },
  created() {
    if (process.client) {
      this.getSignUpedCompetitionCreate(this.school.id);
      this.getAds();
    }
  },

  methods: {
    async getSignUpedCompetitionCreate(schoolId) {
      let res = await this.$axios({
        url: "api/competitionCreate/getSignUpedCompetitionCreate",
        params: {
          schoolId: schoolId,
        },
      });
      if (res.success) {
        this.competitions = res.data.teacherCompetitionVos;
      } else {
        return false;
      }
    },
    toCompetition(id) {
      this.$router.push({
        path: "/static/competition/detail",
        query: {
          id: id,
        },
      });
    },
    async getAds() {
      const res = await this.$axios({
        url: "api/ad/getAdsByTarget",
        params: {
          target: "ad-index",
        },
      });
      if (res.success) {

        this.ads = res.data.indexAdVos;
        
      } else {
        this.$message.error("广告记载错误");
        return false;
      }
    },
    toJump(href){
      if(href!="#"){
        console.log("点击了")
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
.conpetition-bar {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border: 1px solid white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
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

.ad {
  width: 100%;
  padding: 0;
  /* background-color: red; */
}
.ad .adStyle {
  position:absolute;
  top:0;
  left: 0;
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  color: white;


  
}
.el-carousel__item {

}
/* .el-carousel__item:nth-child(2n) {
  background-color: red;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
</style>
