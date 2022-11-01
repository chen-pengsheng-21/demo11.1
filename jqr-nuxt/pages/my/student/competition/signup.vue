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
          <el-breadcrumb-item>
            <a href="/my/student/competition/signup">报名记录</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ student?student.studentName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="add">
        <h3>报名记录</h3>
        <el-button-group>
          <el-button
            type="default"
            icon="el-icon-refresh"
            @click.native="refresh"
            >刷新</el-button
          >
        </el-button-group>
      </div>
      <div class="signup-list">
        <el-table
          ref="multipleTable"
          :data="mySignupCompetitionCreateRecordVos"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="id" label="编号" width="50"> </el-table-column>

          <el-table-column label="报名时间" width="220">
            <template slot-scope="scope">{{
              scope.row.createTime | dateFormat
            }}</template>
          </el-table-column>
          <el-table-column
            prop="competitionCreateName"
            label="竞赛项目"
            width="220"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="checked"
            label="审核状态"
            width="150"
          >
            <template slot-scope="scope">
              <el-select
                v-model="
                  mySignupCompetitionCreateRecordVos[scope.$index]['checked']
                "
                placeholder="请选择"
              >
                <el-option label="未审核" :value="0"> </el-option>
                <el-option label="同意" :value="1"> </el-option>
                <el-option label="驳回" :value="2"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <template slot="empty">
            <el-empty :image-size="60"></el-empty>
          </template>
        </el-table>
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
      mySignupCompetitionCreateRecordVos: [],
    };
  },

  computed: {
    ...mapState(["userinfo", "school","student"]),
  },
  created() {
    if (process.client) {
      this.getMySignupCompetitionCreateRecordByUser(this.userinfo.id);
    }
  },

  methods: {
    async getMySignupCompetitionCreateRecordByUser(userId) {
      let res = await this.$axios({
        url: "api/competitionSignup/getMySignupCompetitionCreateRecordByUser",
        params: {
          userId: userId,
        },
      });
      if (res.success) {
        this.mySignupCompetitionCreateRecordVos =
          res.data.mySignupCompetitionCreateRecordVos;
      }
    },
    refresh() {
      this.getMySignupCompetitionCreateRecordByUser(this.userinfo.id);
    },
  },
  filters: {
    dateFormat(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
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

.main .add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #eee;
}
</style>