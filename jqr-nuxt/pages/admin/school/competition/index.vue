<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school/competition"
              >推荐赛事管理</a
            ></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school?school.schoolName:'' }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="competitions" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="name" label="竞赛名称"> </el-table-column>
        <el-table-column prop="start" label="开始时间"> </el-table-column>
        <el-table-column prop="end" label="结束时间"> </el-table-column>
        <el-table-column prop="type" label="竞赛类型"> </el-table-column>
        <el-table-column prop="organizer" label="组织单位"> </el-table-column>
        <el-table-column prop="rank" label="竞赛等级"> </el-table-column>
        <el-table-column prop="homePage" label="官网网址"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)"
              >编辑</el-button
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
     
    </el-main>
     <el-dialog
        title="竞赛编辑"
        width="60%"
        :visible.sync="dialogCompetitionVisible"
      >
        <el-form :model="competition" ref="form" :rules="rules" status-icon>
          <el-form-item
            label="竞赛名称"
            prop="name"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="competition.name"
              autocomplete="off"
              placeholder="竞赛名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="竞赛周期" :label-width="formLabelWidth">
            <el-col :span="12">
              <el-form-item prop="start">
                <el-input
                  v-model="competition.start"
                  autocomplete="off"
                  placeholder="输入竞赛开始时间:每年几月份开始"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="end">
                <el-input
                  v-model="competition.end"
                  autocomplete="off"
                  placeholder="输入竞赛结束时间:每年几月份开始"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="类型等级" :label-width="formLabelWidth">
            <el-col :span="12">
              <el-form-item prop="type">
                <el-select
                  v-model="competition.type"
                  placeholder="请选择竞赛类型"
                >
                  <el-option label="个人赛" value="个人赛"> </el-option>
                  <el-option label="团队赛" value="团队赛"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="level">
                <el-select
                  v-model="competition.level"
                  placeholder="请选择竞赛等级"
                >
                  <el-option label="国际级" value="国际级"> </el-option>
                  <el-option label="国家级" value="国家级"> </el-option>
                  <el-option label="省级" value="省级"> </el-option>
                  <el-option label="市级" value="市级"> </el-option>
                  <el-option label="校级" value="校级"> </el-option>
                  <el-option label="院级" value="院级"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            label="主办单位"
            prop="organizer"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="competition.organizer"
              autocomplete="off"
              placeholder="请输入主办单位"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="竞赛官网"
            prop="homePage"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="competition.homePage"
              autocomplete="off"
              placeholder="请输入竞赛官网"
            ></el-input>
          </el-form-item>
        

          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >保存</el-button
            >
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
      dialogCompetitionVisible: false,
      competition: {
        id: 0,
        name: "",
        start: "",
        end: "",
        homePage: "",
        type: "",
        level: "",
        schoolId: 0,
      },
      competitions: [],
      handbook: "请输入竞赛方案",
      rules: {
        name: [{ required: true, message: "请输入竞赛名称", trigger: "blur" }],
       
        start: [{ required: true, message: "请输入开始时间", trigger: "blur" }],
        end: [{ required: true, message: "请输入结束时间", trigger: "blur" }],
        type: [{ required: true, message: "请输入竞赛类型", trigger: "blur" }],
        level: [{ required: true, message: "请输入竞赛等级", trigger: "blur" }],
        organizer: [
          { required: true, message: "请输入主办单位", trigger: "blur" },
        ],
      },
       page: {
        current: 1,
        size: 0,
        total: 0,
        schoolId:0,
      },
      sch:{}
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "markdownOption"]),
  },
  created() {
    if (process.client) {
      
      this.getCompetionsPage(1);
    
    }
    
    
  },
  methods: {
    async getCompetionsPage(current) {
        let page={
          current:current,
          size:10,
          schoolId:this.school.id
        }
        let res=await this.$axios({
          url:'api/competition/page',
          method:'post',
          data:page
        })
        if(res.success){
          let page=res.data.page;
          this.competitions=page.records
          this.page=page;

        }

    },
    handleCurrentChange(current){
      this.getCompetionsPage(current);
    },
    toAdd() {
      this.dialogCompetitionVisible = !this.dialogCompetitionVisible;
    },
    async toEdit(id) {
      let res=await this.$axios({
        url:'api/competition/one',
        params:{
          id:id
        }
      })
      if(res.success){
        this.dialogCompetitionVisible = true;
        this.competition=res.data.competition;
      }
      else{
        this.$message.error(res.msg);
        return;
      }
      
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.competition.schoolId=this.school.id;
          if(this.competition.id){
            this.editCompetition(this.competition,formName)
          }
          else{
            this.addCompetition(this.competition,formName)
          }
          
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
   async addCompetition(competition,formName){
      let res= await this.$axios({
            url:'api/competition/add',
            method:'post',
            data:competition
          })
          if(res.success){
            this.getCompetionsPage(this.page.current);
             this.$refs[formName].resetFields();
            this.dialogCompetitionVisible=false;
            this.$message.success(res.msg);
          }
          else{
            this.$message.error(res.msg);
            return;
          }
    },
   async editCompetition(competition,formName){
      let res= await this.$axios({
            url:'api/competition/edit',
            method:'post',
            data:competition
          })
          if(res.success){
            this.getCompetionsPage(this.page.current);
            this.$refs[formName].resetFields();
            this.dialogCompetitionVisible=false;
            this.$message.success(res.msg);
          }
          else{
            this.$message.error(res.msg);
            return;
          }

    }
  },
};
</script>

<style>
</style>