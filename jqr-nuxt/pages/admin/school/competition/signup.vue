<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my"
              >{{ userinfo ? userinfo.userType : "" }}中心</a
            ></el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/admin/school/competition/teacher">我的竞赛</a></el-breadcrumb-item
          >
          
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo ? userinfo.userName : "" }}</div>
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
            icon="el-icon-check"
            @click.native="checkedBatchSignup"
            >同意</el-button
          >
          <el-button
            type="default"
            icon="el-icon-close"
            @click.native="rejectBatchSignup"
            >驳回</el-button
          >
          <el-button type="default" icon="el-icon-coffee" @click.native="clear"
            >清空</el-button
          >
        </el-button-group>
      </div>
      <div class="signup-list">
        <el-tabs v-model="activeName">
          <el-tab-pane label="未审核" name="first">
            <el-table
              ref="multipleTable"
              :data="studentSignups0"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" prop="id">
              </el-table-column>
              <el-table-column prop="id" label="编号" width="50">
              </el-table-column>

              <el-table-column label="报名时间" width="220">
                <template slot-scope="scope">{{
                  scope.row.createTime | dateFormat
                }}</template>
              </el-table-column>

              <el-table-column prop="student.depart" label="部门" width="150">
              </el-table-column>
              <el-table-column prop="student.major" label="专业" width="150">
              </el-table-column>
              <el-table-column
                prop="student.classinfo"
                label="班级"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="student.studentName"
                label="姓名"
                width="120"
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
                    v-model="studentSignups0[scope.$index]['checked']"
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
          </el-tab-pane>
          <el-tab-pane label="同意" name="second">
            <el-table
              ref="multipleTable"
              :data="studentSignups1"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" prop="id">
              </el-table-column>
              <el-table-column prop="id" label="编号" width="50">
              </el-table-column>

              <el-table-column label="报名时间" width="220">
                <template slot-scope="scope">{{
                  scope.row.createTime | dateFormat
                }}</template>
              </el-table-column>

              <el-table-column prop="student.depart" label="部门" width="150">
              </el-table-column>
              <el-table-column prop="student.major" label="专业" width="150">
              </el-table-column>
              <el-table-column
                prop="student.classinfo"
                label="班级"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="student.studentName"
                label="姓名"
                width="120"
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
                    v-model="studentSignups1[scope.$index]['checked']"
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
          </el-tab-pane>
          <el-tab-pane label="驳回" name="third">
            <el-table
              ref="multipleTable"
              :data="studentSignups2"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" prop="id">
              </el-table-column>
              <el-table-column prop="id" label="编号" width="50">
              </el-table-column>

              <el-table-column label="报名时间" width="220">
                <template slot-scope="scope">{{
                  scope.row.createTime | dateFormat
                }}</template>
              </el-table-column>

              <el-table-column prop="student.depart" label="部门" width="150">
              </el-table-column>
              <el-table-column prop="student.major" label="专业" width="150">
              </el-table-column>
              <el-table-column
                prop="student.classinfo"
                label="班级"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="student.studentName"
                label="姓名"
                width="120"
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
                    v-model="studentSignups2[scope.$index]['checked']"
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
      studentSignups0: [],
      studentSignups1: [],
      studentSignups2: [],
      checkedSignups: [],
      queryId: 0, //传参值
      activeName:'first'
    };
  },
  validate({ query }) {
    return /^\d+$/.test(parseInt(query.id));
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  created() {
    if (process.client) {
      let { id } = this.$route.query;
      this.queryId = id;
      this.getStudentSignupCompetitionVos(id);
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.checkedSignups = val;
    },
    async getStudentSignupCompetitionVos(competitionId) {
      let res = await this.$axios({
        url: "api/competitionSignup/getStudentSignupCompetitionVos",
        params: {
          competitionId: competitionId,
        },
      });
      if (res.success) {
        let studentSignups = res.data.studentSignupCompetitionVos;
        this.studentSignups0 = studentSignups.filter((ss) => {
          return ss.checked === 0;
        });
        this.studentSignups1 = studentSignups.filter((ss) => {
          return ss.checked === 1;
        });

        this.studentSignups2 = studentSignups.filter((ss) => {
          return ss.checked === 2;
        });
      }
    },
    checkedBatchSignup() {
      let checkedSignups = this.checkedSignups;
      if (checkedSignups.length == 0) {
        this.$message.error("审核数据不能为空");
        return false;
      }
      let ids = [];
      checkedSignups.forEach((element) => {
        ids.push(element.id);
      });
      let checkedSignupCompetition = {
        ids: ids,
        checked: 1,
      };
      //同意
      this.updateBatch(checkedSignupCompetition);
    },
    rejectBatchSignup() {
      let checkedSignups = this.checkedSignups;
      if (checkedSignups.length == 0) {
        this.$message.error("审核数据不能为空");
        return false;
      }
      let ids = [];
      checkedSignups.forEach((element) => {
        ids.push(element.id);
      });
      let checkedSignupCompetition = {
        ids: ids,
        checked: 2,
      };
      //驳回
      this.updateBatch(checkedSignupCompetition);
    },
    async updateBatch(checkedSignupCompetition) {
      let res = await this.$axios({
        url: "api/competitionSignup/updateBatchCheckSignupCompetitionDTO",
        method: "post",
        data: checkedSignupCompetition,
      });
      if (res.success) {
        this.clear();
        this.getStudentSignupCompetitionVos(this.queryId);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    clear() {
      this.$refs.multipleTable.clearSelection();
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