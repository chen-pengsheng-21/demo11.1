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
            ><a href="/admin/school/competition/teacher"
              >竞赛管理</a
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
        <h3>竞赛管理</h3>
        <el-button type="primary" icon="el-icon-plus" @click="competitionAdd"
          >新建</el-button
        >
      </div>
      <div class="competition-list">
        <el-table :data="competitions" border style="width: 100%">
          <el-table-column fixed prop="id" label="#" width="50">
          </el-table-column>
          <el-table-column prop="title" label="竞赛名称" width="200"> </el-table-column>
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
              <span>{{ scope.row.checked==0 ? '未审核':'审核' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="signup" label="报名？" width="120">
            <template slot-scope="scope">
              <el-select
                v-model="competitions[scope.$index]['signup']"
                placeholder="请选择"
                  @change="
                  changeSignup(
                    competitions[scope.$index]['id'],
                    competitions[scope.$index]['checked'],
                    competitions[scope.$index]['signup']
                  )
                "
              >
                <el-option label="未报名" :value="0"> </el-option>
                <el-option label="报名" :value="1"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="120">
            <template slot-scope="scope">
              <el-select
                v-model="competitions[scope.$index]['state']"
                placeholder="请选择"
                @change="
                  changeState(
                    competition.id,
                    competition.checked,
                    competition.state,
                  )
                "
              >
                <el-option label="未启用" :value="0"> </el-option>
                <el-option label="运行" :value="1"> </el-option>
                <el-option label="结束" :value="2"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="toEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="toSignup(scope.row.id)"
                >报名记录</el-button
              >
            </template>
          </el-table-column>
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
      title="竞赛编辑"
      width="80%"
      :visible.sync="dialogCompetitionVisible"
    >
      <el-form :model="competition" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="竞赛标题"
          prop="title"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="competition.title"
            autocomplete="off"
            placeholder="请输入竞赛标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="竞赛对象"
          prop="target"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="competition.target"
            autocomplete="off"
            placeholder="请输入竞赛对象"
          ></el-input>
        </el-form-item>
        <el-form-item label="竞赛周期" :label-width="formLabelWidth">
          <el-col :span="12">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="competition.startTime"
                type="date"
                placeholder="竞赛开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="competition.endTime"
                type="date"
                placeholder="竞赛结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item
          label="赛事来源"
          prop="aimCompetition"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="competition.aimCompetition"
            placeholder="请选择赛事来源"
          >
            <el-option
              v-for="item in aimCompetitions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="赛事类型"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-select v-model="competition.type" placeholder="请选择">
            <el-option label="个人赛" value="个人赛"> </el-option>
            <el-option label="团队赛" value="团队赛"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="竞赛方案"
          prop="content"
          :label-width="formLabelWidth"
        >
           <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="competition.content"
              @imgAdd="$imgAdd"
              @imgDel="$imgDel"
              ref="md"
            />
          </client-only>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "my",
  data() {
    let dateComparison = (rule, value, callback) => {
      let startTime = this.competition.startTime;
      let comparison = value - startTime;
      if (comparison < 0) {
        callback(new Error("结束时间要大于开始时间"));
      } else {
        callback();
      }
    };
    return {
       handbook: "#### 你在岁月静好,我在负重前行",
     
      dialogCompetitionVisible: false,
      formLabelWidth: "100px",
      userType: "",
      handbook: "",
      competitions: [],
      competition: {
        id: 0,
        title: "",
        content: "",
        startTime: "",
        endTime: "",
        signup: 0,
        type: "",
        target: "",
        aimCompetition: "",
        state: 0,
        checked: 0,
        schoolId: 0,
        userId: 0,
      },
      signupedCount: 0,
      rules: {
        title: [{ required: true, message: "必填项", trigger: "blur" }],
        content: [{ required: true, message: "必填项", trigger: "blur" }],
        startTime: [{ required: true, message: "必填项", trigger: "blur" }],
        endTime: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: dateComparison, message: "结束时间应该晚于开始时间" },
        ],
        target: [{ required: true, message: "必填项", trigger: "blur" }],
        type: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      aimCompetitions: [],
      page: {
        current: 1,
        size: 0,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school","markdownOption"]),
  },
  created() {
    if (process.client) {
     this.getAimCommpetitions();
      this.getCompetitionCreateByUserId(this.userinfo.id,1);
    }
  },

  methods: {
    handleCurrentChange(current){
      this.page.current=current;

    },
    competitionAdd() {
      this.dialogCompetitionVisible = !this.dialogCompetitionVisible;
      //   this.$router.push("/my/doc/doc");
    },
    async getAimCommpetitions() {
      let arr = ["id", "name"];
      let res = await this.$axios({
        url: "api/competition/colums?colums=" + arr,
      });
      if (res.success) {
        this.aimCompetitions = res.data.competitions;
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //console.log(this.competition);
          this.competition.schoolId = this.school.id;
          this.competition.userId = this.userinfo.id;
          if (this.competition.id === 0) {
            this.addCompetitionCreate(this.competition);
            this.$refs[formName].resetFields();
          } else {
            this.editCompetitionCreate(this.competition);
            this.$refs[formName].resetFields();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async addCompetitionCreate(competitionCreate) {
      let res = await this.$axios({
        url: "api/competitionCreate/add",
        method: "post",
        data: competitionCreate,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.getCompetitionCreateByUserId(this.userinfo.id,this.page.current);
        this.dialogCompetitionVisible = false;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async editCompetitionCreate(competitionCreate) {
      let res = await this.$axios({
        url: "api/competitionCreate/edit",
        method: "post",
        data: competitionCreate,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.getCompetitionCreateByUserId(this.userinfo.id,this.page.current);
        this.dialogCompetitionVisible = false;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },

    onEditorChange({ editor, html, text }) {
      //console.log("editor change!", editor, html, text);
      this.competition.content = html;
    },
    async toEdit(id) {
      this.dialogCompetitionVisible = true;
      
      let res = await this.$axios({
        url: "api/competitionCreate/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.competition = res.data.competitionCreate;
         
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async getCompetitionCreateByUserId(userId, current) {
      let userPage = {
        userId: userId,
        current: current,
        size: 10,
      };

      let res = await this.$axios({
        url: "api/competitionCreate/page/user",
        method: "post",
        data: userPage,
      });
      if (res.success) {
     
        let page = res.data.page;
        this.competitions = page.records;
        this.page=page;
      } else {
        return false;
      }
    },
    changeSignup(id, checked, signup) {
      console.log(id, checked, signup);
      if (checked === 0) {
        this.$message.error("竞赛还未审核,该竞赛不能开始报名");
        this.getCompetitionCreateByUserId(this.userinfo.id,this.page.current);

        return false;
      }

      let competitionCreate = {
        id: id,
        signup: signup, //1竞赛开始报名,竞赛状态应该属于运行状态
      };
      this.editCompetitionCreateSignup(competitionCreate,this.page.current);
    },
    changeState(id, checked, state) {
      if (checked === 0) {
        this.$message.error("竞赛还未审核,该竞赛不能开始报名");
        this.getCompetitionCreateByUserId(this.userinfo.id,this.page.current);

        return false;
      }

      let competitionCreate = {
        id: id,
        state: state,
      };
      this.editCompetitionCreateState(competitionCreate,this.page.current);
    },
    async editCompetitionCreateSignup(signup) {
      let res = await this.$axios({
        url: "api/competitionCreate/signup",
        method: "post",
        data: signup,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.getCompetitionCreateByUserId(this.userinfo.id);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    async editCompetitionCreateState(state) {
      let res = await this.$axios({
        url: "api/competitionCreate/state",
        method: "post",
        data: state,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.getCompetitionCreateByUserId(this.userinfo.id,this.page.current);
      } else {
        this.$message.error(res.msg);
        return false;
      }
    },
    toSignup(competitionId) {
      //要使用原生事件.native
      this.$router.push({
        path: "/admin/school/competition/signup",
        query: {
          id: competitionId,
        },
      });
    },
      $imgAdd(pos, $file){
       var formdata = new FormData();
       formdata.append('file', $file);
       this.$axios({
        url:'api/upload/img',
        method:'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
       }).then(res=>{
          let url=res.data.imgPath
          this.$refs.md.$img2Url(pos, url)

       }).catch(err=>{
          this.$message.error(err);
       })
    },
    $imgDel(){

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
.el-badge {
  margin-right: 20px;
}
</style>