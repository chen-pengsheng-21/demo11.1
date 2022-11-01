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
            ><a href="/admin/school/community">社团管理</a></el-breadcrumb-item
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
      <el-table :data="communitys" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="logo" label="logo" width="80">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.logo | communityLogo"
              fit="fit"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="schoolId" label="学校">
          <template slot-scope="scope">
            <el-select
              v-model="communitys[scope.$index]['schoolId']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in schools"
                :key="item.id"
                :label="item.schoolName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="departId" label="部门">
          <template slot-scope="scope">
            <el-select
              v-model="communitys[scope.$index]['departId']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departs"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="社团" width="120">
        </el-table-column>
        <el-table-column prop="teachers" label="指导教师"> </el-table-column>
        <el-table-column prop="charger" label="负责人(学生)"> </el-table-column>
        <el-table-column prop="status" label="社团状态">
          <template slot-scope="scope">
            <el-select
              v-model="communitys[scope.$index]['status']"
              placeholder="请选择社团状态"
              @change="selectStatus"
            >
              <el-option label="未审核" value="0"> </el-option>
              <el-option label="启用" value="1"> </el-option>
              <el-option label="终止" value="2"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="联系电话" width="120">
        </el-table-column>
        <el-table-column prop="email" label="电子邮件" width="120">
        </el-table-column>
        <el-table-column prop="email" label="微信公众号" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toAdd" type="text" size="small">添加</el-button>
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
    <el-dialog title="社团编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="community" ref="form" :rules="rules" status-icon>
        <el-form-item label="上传logo" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-input
              v-model="community.logo"
              placeholder="请上传社团logo"
            ></el-input>
          </el-col>
          <el-col :span="span+span4+span8">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="社团名称" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="name">
              <el-input
                v-model="community.name"
                autocomplete="off"
                placeholder="请输入社团名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="type">
              <el-select v-model="community.type" placeholder="请选择社团类型">
                <el-option label="通用社团" value="0"> </el-option>
                <el-option label="专业社团" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="学校部门" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="schoolId">
              <el-select
                v-model="community.schoolId"
                placeholder="请选择学校"
                @change="selectSchool"
              >
                <el-option
                  v-for="item in schools"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="depart">
              <el-select v-model="community.depart" placeholder="请选择部门">
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="指导教师" :label-width="formLabelWidth">
          <el-col :span="span0">
            <el-form-item prop="teachers">
              <el-input type="hidden" v-model="community.teachers"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span8">
            <el-input placeholder="请选择指导教师"></el-input>
          </el-col>
          <el-col :span="span4">
            <el-button
              type="primary"
              icon="el-icon-user-solid"
              @click="toAddTeacher"
              >添加导师</el-button
            >
          </el-col>
          <el-col :span="span0">
            <el-input type="hidden" v-model="community.charger"></el-input>
          </el-col>
          <el-col :span="span8">
            <el-input placeholder="请选择社团负责人"></el-input>
          </el-col>
          <el-col :span="span4">
            <el-button type="primary" icon="el-icon-user" @click="toAddStudent"
              >添加负责人</el-button
            >
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="mobile">
              <el-input
                v-model="community.mobile"
                autocomplete="off"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="email">
              <el-input
                v-model="community.email"
                autocomplete="off"
                placeholder="请输入电子邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="weixin">
              <el-input
                v-model="community.weixin"
                autocomplete="off"
                placeholder="请输入微信公众号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="社团地址"
          prop="address"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="community.address"
            autocomplete="off"
            placeholder="请输入社团地址"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="社团介绍"
          prop="description"
          :label-width="formLabelWidth"
        >
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="community.description"
              ref="md"
            />
          </client-only>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">编辑</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

 <el-dialog title="选择指导教师" width="60%" :visible.sync="dialogTeachersVisible">
   <el-form :model="selectTeatchers" ref="formTeacher" :rules="rules" status-icon>
      <el-form-item label="学校部门" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="schoolId">
              <el-select
                v-model="selectTeatchers.schoolId"
                placeholder="请选择学校"
                @change="selectSchool"
              >
                <el-option
                  v-for="item in schools"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="depart">
              <el-select v-model="selectTeatchers.departId" placeholder="请选择部门">
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="span">
            <el-form-item prop="teachers">
              <el-select v-model="selectTeatchers.teachers" placeholder="请选择部门">
                <el-option
                  v-for="item in teachers"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
   </el-form>

 </el-dialog>
 <el-dialog title="选择社团负责人（学生）" width="60%" :visible.sync="dialogStudentVisible">
    <el-form :model="selectStudent" ref="formStudent" :rules="rules" status-icon>
       <el-form-item label="学校部门班级" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="schoolId">
              <el-select
                v-model="selectStudent.schoolId"
                placeholder="请选择学校"
                @change="selectSchool"
              >
                <el-option
                  v-for="item in schools"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="depart">
              <el-select v-model="selectStudent.departId" placeholder="请选择部门">
                <el-option
                  v-for="item in departs"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="span">
            <el-form-item prop="teachers">
              <el-select v-model="selectStudent.classinfoId" placeholder="请选择班级">
                <el-option
                  v-for="item in classinfos"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
    
      span: 6,
      span0:0,
      span8:8,
      span4:4,
      formLabelWidth: "100px",
      sch:{},
      imageUrl: "",
      schools: [],
      departs: [],
      teachers:[],
      students:[],
      classinfos:[],
      communitys: [],
      community: {
        id: 0,
        name: "",
        type: "",
        teachers: "",
        depart: "",
        logo: "",
        charger: "",
        status: "",
        address: "",
        mobile: "",
        email: "",
        schoolId: "",
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      dialogFormVisible: false,
      dialogTeachersVisible:false,
dialogStudentVisible:false,
      handbook: "",
      selectTeatchers:{
        schoolId:'',
        departId:'',
        teachers:[]
      },
      selectStudent:{

      },
      rules: {},
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption",'school']),
  },
  
  created() {
    if (process.client) {
  
      this.sch=this.school;
      this.getSchools();
      this.getDeparts();
    }
  },
  methods: {
    getSchools() {
      let arr = ["id", "school_name"];
      this.$axios({
        url: "/api/school/colums?colums=" + arr,
        method: "get",
      })
        .then((res) => {
          if (res.success) {
            this.schools = res.data.schools;
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
    },
    getDeparts() {
      let arr = ["id", "depart_name"];
      this.$axios({
        url: "/api/department/colums?colums=" + arr,
        method: "get",
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
          this.dialogFormVisible = false;
          return false;
        });
    },
    getCommunitysPage(current) {
      let page = {
        current: 1,
        size: 10,
        colums: ["id", "name", "type", "teachers", "depart", "logo"],
      };
    },
    selectSchool(id) {


    },
    getCommunitysPage(current) {},
    handleCurrentChange(val) {},
    toAdd() {
      this.dialogFormVisible = !this.dialogFormVisible;
      // this.getSchools();
      // this.getDeparts();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.depart.id == 0) {
            this.$axios({
              url: "/api/community/add",
              method: "post",
              data: this.community,
            })
              .then((res) => {
                if (res.success) {
                  this.departs.push(this.depart);
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
          } else {
            this.$axios({
              url: "/api/community/edit",
              method: "post",
              data: this.community,
            })
              .then((res) => {
                if (res.success) {
                  this.departs.forEach((element) => {
                    element.id = this.depart.id;
                    element = this.depart;
                  });
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toAddTeacher() {},
    toAddStudent() {},
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  filters: {
    communityLogo(value) {
      if (value) {
        return value;
      } else {
        return "@/static/logo.png";
      }
    },
  },
  watch: {},
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>