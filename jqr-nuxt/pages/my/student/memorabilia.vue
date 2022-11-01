<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo?userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/my/doc/memorabilia">人生轨迹</a></el-breadcrumb-item
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
      <div class="doc-add">
        <h3>人生轨迹</h3>
        <el-button-group>
          <el-button
            type="default"
            :icon="reverse ? 'el-icon-moon' : 'el-icon-moon-night'"
            @click="btnReverse"
            >{{ reverse ? "倒序" : "正序" }}</el-button
          >
          <el-button type="primary" icon="el-icon-document-add" @click="docAdd"
            >新建</el-button
          >
        </el-button-group>
      </div>
      <div class="memorabilia-list">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(memorabilia, index) in memorabilias"
            :key="index"
            :type="randomType(index)"
            size="large"
            :timestamp="dateFormat(memorabilia.happenTime)"
          >
            {{ memorabilia.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-main>
    <el-dialog
      title="轨迹添加"
      :visible.sync="dialogMemorabiliaVisible"
      :center="true"
    >
      <el-form :model="memorabilia" ref="memorabiliaForm" :rules="rules">
        <el-form-item prop="happenTime" label="发生时间" label-width="100px">
          <el-date-picker
            v-model="memorabilia.happenTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="content" label="轨迹内容" label-width="100px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="memorabilia.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
            
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-button  type="primary" @click="onSubmit('memorabiliaForm')"
              >添加</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from 'dayjs'
export default {
  layout: "my",
  data() {
    return {
      reverse: true,
      memorabilias: [
        {
          content: "该同志比较懒，还没记录人生轨迹",
          happenTime: "2018-04-15",
        },
       
      ],

      dialogMemorabiliaVisible: false,
      memorabilia: {
        happenTime: "",
        content: "",
        userId: 0,
      },
      rules: {
        happenTime: [
            {type: 'date',required:true,message:'发生时间不能为空',trigger:'blur'},
        ],
        content: [
            {required:true,message:'内容不能为空',trigger:'blur'},
            {min:1,max:100,message:'内容长度在1到100之间',trigger:'blur'}

        ],
      },
      user:{},
      types:['primary','success','warning','danger','info']
    };
  },
  computed: {
    ...mapState(["userinfo","school","student"]),
  },
  created() {
    if (process.client) {
        this.getMemorabiliasByUserId(this.userinfo.id);
    }
  },

  methods: {
    docAdd() {
      this.dialogMemorabiliaVisible = !this.dialogMemorabiliaVisible;
    },
    btnReverse() {
      this.reverse = !this.reverse;
    },
    onSubmit(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.memorabilia.userId=this.userinfo.id;
            let res=await this.$axios({
                url:'api/memorabilia/add',
                method:'post',
                data:this.memorabilia
            })
            if(res.success){
                this.$refs[formName].resetFields();
                this.$message.success(res.msg)
                getMemorabiliasByUserId(this.user.id);
            }
            else{
                this.$message.error(res.msg)
                this.$refs[formName].resetFields();
                return;
            }


          } else {
            this.$message.error('表单验证错误')
            return;
          }
        });
    },
    async getMemorabiliasByUserId(userId){
        let res=await this.$axios({
            url:'api/memorabilia/userMemorabilias',
            params:{
                userId:userId
            }
        })
        if(res.success){
            this.memorabilias=res.data.memorabilias
        }
        else{
            this.$message.error(res.msg)
          
        }
    },
    dateFormat(value){

         return dayjs(value).format('YYYY-MM-DD');
    },
    randomType(index){
        let i=index%5
        return this.types[i]
    }
  },
  watch:{

  }
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
.memorabilia-list {
  display: flex;
  margin-top: 10px;
}
</style>