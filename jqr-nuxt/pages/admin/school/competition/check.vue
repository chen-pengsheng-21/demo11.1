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
            ><a href="/my/teacher/competition/"
              >教师竞赛中心</a
            ></el-breadcrumb-item
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
      <div class="doc-add">
        <h3>未审核竞赛列表</h3>
      </div>
      <div class="competition-list">
        <el-table :data="competitions" border style="width: 100%">
          <el-table-column fixed prop="id" label="#" width="50">
          </el-table-column>
          <el-table-column prop="aimCompetitionName" label="赛事来源">
          </el-table-column>
          <el-table-column prop="teacher.depart" label="学院">
          </el-table-column>
          <el-table-column prop="teacher.teacherName" label="负责人">
          </el-table-column>
          <el-table-column prop="title" label="竞赛名称"> </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.startTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="target" label="赛事对象" width="150">
          </el-table-column>
          <el-table-column prop="type" label="赛事类型" width="100">
          </el-table-column>
          <el-table-column prop="checked" label="审核" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.checked == 0 ? "未审核" : "审核" }}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toCheck(scope.row.id)"
                >审核</el-button
              >
            </template>
          </el-table-column>
           <template slot="empty">
          <el-empty :image-size="60"></el-empty>
        </template>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </div>
    </el-main>

    <el-dialog
      width="80%"
      v-if="dialogCompetitionVisible"
      :visible.sync="dialogCompetitionVisible"
    >
      <div class="competition">
        <el-descriptions :title="competition.title">
          <el-descriptions-item label="开始时间">{{
            competition.startTime | dateFormat
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            competition.endTime | dateFormat
          }}</el-descriptions-item>
          <el-descriptions-item label="赛事目标">{{
            competition.target
          }}</el-descriptions-item>
          <el-descriptions-item label="赛事负责人">
            <el-tag type="success">{{
              competition.teacher ? competition.teacher.depart : ""
            }}</el-tag>
            <el-tag>{{
              competition.teacher ? competition.teacher.teacherName : ""
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            label="赛事来源"
            v-if="competition.aimCompetition > 0"
            >{{ competition.aimCompetitionName }}</el-descriptions-item
          >
        </el-descriptions>
      </div>
      <el-divider content-position="right">赛事方案</el-divider>
      <div v-html="competition.content"></div>
      <el-button type="primary" @click="checkCompetitionCreate(competition.id)"
        >竞赛审核</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "my",
  data() {
    return {
      dialogCompetitionVisible: false,

      competitions: [],
      competition: {},
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  created() {
    if (process.client) {
      this.getCheckCompetitionVoBySchoolId(this.school.id);
    }
  },

  methods: {
    async toCheck(id) {
      this.dialogCompetitionVisible = true;
      this.getCheckCompetitionVoById(id);
    },
    async getCheckCompetitionVoById(id) {
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
    async getCheckCompetitionVoBySchoolId(schoolId) {
      let res = await this.$axios({
        url: "api/competitionCreate/getUnCheckTeacherCompetitionVosBySchoolId",
        params: {
          schoolId: schoolId,
        },
      });
      if (res.success) {
        //根据所属学院查询该学院的所有未审核赛事
        console.log(res);
        this.competitions = res.data.checkCompetitionVos;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    checkCompetitionCreate(competitionId) {
      //更新
      console.log(competitionId);
      let competitionCreate = {
        id: competitionId,
        checked: 1,
      };
      this.checkedCompetitionCreate(competitionCreate);

      //用户日志
    },

    async checkedCompetitionCreate(competitionCreate) {
      let res = await this.$axios({
        url: "api/competitionCreate/check",
        method: "post",
        data: competitionCreate,
      });
      if (res.success) {
        this.getCheckCompetitionVoBySchoolId(this.school.id);

        this.$message.success(res.msg);
        this.dialogCompetitionVisible = false;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    handleCurrentChange(current) {
      this.page.current = current;
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