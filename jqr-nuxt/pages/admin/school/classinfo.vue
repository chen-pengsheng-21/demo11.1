<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType :''}}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school/classinfo">班级管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd">添加</el-button>
      </div>
      <el-table :data="classinfos" border style="width: 100%" v-if="isReloadData">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        
        <el-table-column prop="depart" label="部门">
          <template slot-scope="scope">
            <el-select
              v-model="classinfos[scope.$index]['depart']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departs"
                :key="item.id"
                :label="item.departName"
                :value="item.departName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="major" label="专业">
          <template slot-scope="scope">
            <el-select
              v-model="classinfos[scope.$index]['major']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in majors"
                :key="item.id"
                :label="item.majorName"
                :value="item.majorName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="班级" width="200"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-select
              v-model="classinfos[scope.$index]['state']"
              placeholder="请选择状态"
            >
              <el-option label="未启用" :value="0"> </el-option>
              <el-option label="启用" :value="1"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)">编辑</el-button >
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button >
            <el-button type="text" size="small" @click="importExcel(scope.row.id)">导入学生</el-button >
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
     <el-dialog title="班级编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="classinfo" ref="form" :rules="rules" status-icon>
          <el-form-item label="部门|专业" :label-width="formLabelWidth">
          
          <el-col :span="span">
            <el-form-item prop="depart">
              <el-select
                v-model="classinfo.depart"
                placeholder="请选择部门"
                @change="selectDepart"
              >
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.departName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="span">
            <el-form-item prop="major">
              <el-select
                v-model="classinfo.major"
                placeholder="请选择专业"
              >
                <el-option
                  v-for="item in majors"
                  :key="item.id"
                  :label="item.majorName"
                  :value="item.majorName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="班级"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="classinfo.name"
            autocomplete="off"
            placeholder="请输入班级如：年+专业+班 2019 软件工程 1班"
          ></el-input>
        </el-form-item>
        
        <el-form-item
          label="状态"
          prop="state"
          :label-width="formLabelWidth"
        >
          <el-select v-model="classinfo.state" placeholder="请选择状态">
            <el-option label="未启用" :value="0" ></el-option>
            <el-option label="启用" :value="1" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">编辑</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  layout: "my",
  data() {
    return {
      isReloadData:true,
   
      dialogFormVisible: false,
      sch:{},
      formLabelWidth:'100px',
      departs: [],
      majors:[],
      span:6,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },

      classinfos:[],
      classinfo:{
        id:0,
        name:'',
        school:'',
        depart:'',
        major:'',
        state:1
      },
      rules:{
        name:[
          {required:true,message:'必填项',trigger:'blur'}
        ],
       
         departId:[
          {required:true,message:'必填项',trigger:'blur'}
        ],
         majorId:[
          {required:true,message:'必填项',trigger:'blur'}
        ]
      }
    };
  },
  computed: {
    ...mapState(["userinfo",'school']),
  },
  created() {
    if (process.client) {

      this.sch=this.school;
      this.getDeaprtsBySchoolId(this.school.id)
      this.getMajorsForSelectBySchoolId(this.school.id)
      this.getClassinfosPageBySchoolId(this.school.schoolName,1);
      
    }
  },
  methods:{
    getDeaprtsBySchoolId(schoolId) {
      this.$axios({
        url: "/api/department/getDepartsForSelectBySchoolId",
        params:{
          schoolId:schoolId
        }
        
      })
        .then((res) => {
          if (res.success) {
            this.departs = res.data.departments;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });

          return false;
        });
    },
     getMajorsForSelectBySchoolId(schoolId) {
      this.$axios({
        url: "/api/major/getMajorsForSelectBySchoolId",
        params: {
          schoolId: schoolId
        },
      })
        .then((res) => {
          if (res.success) {
            this.majors = res.data.majors;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
  
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });
    
          return false;
        });
    },
    async getClassinfosPageBySchoolId(schoolId,current){
      
      let res= await this.$axios({
        url:'/api/classinfo/page/school',
        params:{
          current:current,
          size:10,
          school:schoolId
       }
      })
      if(res.success){
        console.log(res)
        let page=res.data.page
        this.classinfos=page.records;
        this.page=page;
      }
      else{
         this.$message({
            message: res.msg,
            center: true,
          });
          return false;
      }
    },
     getDeaprtsBySchoolId(id) {
      this.$axios({
        url: "/api/department/getDepartsBySchoolId",
        method: "get",
        params: {
          schoolId: id,
        },
      })
        .then((res) => {
          if (res.success) {

            this.departs = res.data.departments;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });

          return false;
        });
    },
    getMajorsByDepartId(departId){

       this.$axios({
        url: "/api/major/getMajorForSelectByDepartId",
        params: {
          departId: departId,
        },
      })
        .then((res) => {
          if (res.success) {

            this.majors = res.data.majors;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
            return false;
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });

          return false;
        });
      
    },
    async getClassinfo(id){
      let res=await this.$axios({
        url:'/api/classinfo/one',
        params:{
          id:id
        }
      })
      if(res.success){
          this.classinfo=res.data.classinfo;
      }
      else{
         this.$message({
            message: res.msg,
            center: true,
          });

          return false;
      }
    },
    toAdd(){
      let classinfo={
        id:0,
        name:'',
        school:'',
        depart:'',
        major:'',
        state:1
      };
      this.classinfo=classinfo;
      this.dialogFormVisible=!this.dialogFormVisible;

    },
    toEdit(id){
      this.dialogFormVisible=!this.dialogFormVisible;
      this.getClassinfo(id);

    },
    del(id){
     
    },
    handleCurrentChange(current){
      this.page.current=current;
      this.getClassinfosPage(current);
    },
    submitForm(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
            this.classinfo.school=this.school.schoolName;
          if (this.classinfo.id == 0) {
            this.$axios({
              url: "/api/classinfo/add",
              method: "post",
              data: this.classinfo,
            })
              .then((res) => {
                if (res.success) {
                  this.dialogFormVisible = false;
                  this.reloadPart();
                  // this.classinfos.push(this.classinfo)
                  
                } else {
                  this.$message({
                    message: res.msg,
                    center: true,
                  });
                  return false;
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  center: true,
                });
                this.dialogFormVisible = false;
                return false;
              });
          } else {
            this.$axios({
              url: "/api/classinfo/edit",
              method: "post",
              data: this.classinfo,
            })
              .then((res) => {
                if (res.success) {
                 
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    message: res.msg,
                    center: true,
                  });
                  return false;
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  center: true,
                });
                this.dialogFormVisible = false;
                return false;
              });
          }
        } else {
          return false;
        }
      });
    },
   
    selectDepart(depart){
      //console.log(depart);
      this.getMajorsByDepart(depart)
    },
   async getMajorsByDepart(depart){
      this.majors=[];
      let res=await this.$axios({
        url:'/api/major/getMajorsForSelectByDepart',
        params:{
          depart:depart
        }
        
      })
      if(res.success){

        this.majors=res.data.majors;
      }
      else{
        this.$message.error(res.msg);
      }

    },
    importExcel(){

    }

  }
};
</script>

<style scoped>
</style>