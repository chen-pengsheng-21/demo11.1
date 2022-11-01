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
            ><a href="/admin/doc/interview">面试题题库</a></el-breadcrumb-item
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
      <div class="interview-add">
        <h3>面试题列表</h3>
        <el-button type="primary" icon="el-icon-edit" @click="toAdd"
          >新建</el-button
        >
      </div>
      <div class="interview-list">
        <el-table :data="interviews" border stripe>
          <el-table-column prop="id" label="#" :width="50"> </el-table-column>
          <el-table-column prop="title" label="标题"> </el-table-column>
          <el-table-column prop="interviewType" label="面试类型">
            <template slot-scope="scope">
              <el-select
                v-model="interviews[scope.$index]['interviewType']"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in interviewTypes"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button type="text" size="small" @click="del(scope.row.id)"
                >删除</el-button
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

    <el-dialog title="面试题编辑" width="80%" :visible.sync="dialogFormVisible">
      <el-form :model="interview" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="面试题标题"
          prop="title"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="interview.title"
            autocomplete="off"
            placeholder="请输入面试题标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="面试题类型"
          prop="interviewType"
          :label-width="formLabelWidth"
        >
          <el-select v-model="interview.interviewType" placeholder="请选择">
            <el-option
              v-for="item in interviewTypes"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="面试题解析"
          prop="analysis"
          :label-width="formLabelWidth"
        >
        <!-- 图片上传组件辅助-->
       <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="interview.analysis"
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
export default {
  layout: "my",
  data() {
    return {
      formLabelWidth: "100px",
      dialogFormVisible: false,
       handbook: "#### 你在岁月静好,我在负重前行",
      interviews: [],
      interview: {
        id: 0,
        title: "",
        interviewType:"",
        analysis: "",
        userinfoId: 0,
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      interviewTypes: [],
      rules: {
        title: [{ required: true, message: "必填项", triggle: "blur" }],
        interiewType: [{type: 'number', required: true, message: "必填项", triggle: "blur" }],
        analysis: [{ required: true, message: "必填项", triggle: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school","markdownOption"]),
  },
  created() {
    if (process.client) {
      this.getInterviewsPage(this.userinfo.id, 1);
      this.getInterviewTypes();
    }
  },

  methods: {
    handleCurrentChange(current) {
      this.page.current = current;
      this.getInterviewsPage(this.userinfo.id, current);
    },
    async getInterviewsPage(userId, current) {
      let userPage = {
        userId: userId,
        current: current,
        size: 10,
        colums: ["id", "title", "interview_type", "update_time", "userinfo_id"],
      };
      let res = await this.$axios({
        url: "api/interview/getInterviewsPageByUserId",
        method: "post",
        data: userPage,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.interviews = page.records;
      } else {
        return false;
      }
    },
    async getInterviewTypes() {
      let res = await this.$axios({
        url: "api/interviewType/all",
      });
      if (res.success) {
        this.interviewTypes = res.data.interviewTypes;
      } else {
        return false;
      }
    },
    onEditorChange({ editor, html, text }) {
      this.interview.analysis = html;
    },

    async addInterview(interview) {
      let res = await this.$axios({
        url: "api/interview/add",
        method: "post",
        data: interview,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.dialogFormVisible = false;
        this.getInterviewsPage(this.userinfo.id, this.page.current);
      } else {
        return false;
      }
    },
    async editInterview(interview) {
      let res = await this.$axios({
        url: "api/interview/edit",
        method: "post",
        data: interview,
      });
      if (res.success) {
        this.$message.success(res.msg);
        this.dialogFormVisible = false;
        this.getInterviewsPage(this.userinfo.id, this.page.current);
      } else {
        return false;
      }
    },
    async getOne(id) {
      let res = await this.$axios({
        url: "api/interview/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.interview = res.data.interview;
        this.dialogFormVisible = true;
      } else {
        return false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.interview.userinfoId = this.userinfo.id;
          if (this.interview.id == 0) {
            this.addInterview(this.interview);
          } else {
            this.editInterview(this.interview);
          }
        } else {
          return false;
        }
      });
    },
    async toEdit(id) {
      this.getOne(id);
    },
    toAdd() {
      this.dialogFormVisible = true;
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
.interview-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #eee;
}
.quill-editor {
    height: 400px;
  }
</style>