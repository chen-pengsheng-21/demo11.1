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
            ><a href="/my/teacher/course">个人课程</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ teacher ? teacher.teacherName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="user-course-list">
        <h3>我的课程</h3>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="toAdd"
        ></el-button>
        
      </div>
      <el-table :data="myCourseVos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.courses" border stripe>
              <el-table-column label="课程名称" prop="name"> </el-table-column>
              <el-table-column label="课程代码" prop="courseNo">
              </el-table-column>
              <el-table-column label="课程类型" prop="courseType">
              </el-table-column>
              <el-table-column label="专业" prop="major"> </el-table-column>
              <el-table-column label="学院" prop="depart"> </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>

        <el-table-column prop="year" label="学年"> </el-table-column>
        <el-table-column prop="term" label="学期"> </el-table-column>

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
    </el-main>
    <el-dialog title="我的课程" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="myCourseVo" ref="form" :rules="rules" status-icon>
        <el-form-item label="选择课程" :label-width="formLabelWidth">
          <el-col :span="8">
            <el-form-item prop="depart">
              <el-select
                v-model="myCourseVo.depart"
                placeholder="请选择学院"
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
          <el-col :span="8">
            <el-form-item prop="major">
              <el-select
                v-model="myCourseVo.major"
                placeholder="请选择专业"
                @change="selectMajor"
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
          label="选择课程"
          prop="courseIds"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="myCourseVo.courseIds"
            multiple
            placeholder="请选择课程"
          >
            <el-option
              v-for="item in courses"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="year" :label-width="formLabelWidth">
          <el-select v-model="myCourseVo.year" placeholder="请选择学年">
            <el-option label="2022-2023" value="2022-2023"> </el-option>
            <el-option label="2023-2024" value="2023-2024"> </el-option>
            <el-option label="2024-2025" value="2024-2025"> </el-option>
            <el-option label="2025-2026" value="2025-2026"> </el-option>
            <el-option label="2026-2027" value="2026-2027"> </el-option>
            <el-option label="2027-2028" value="2027-2028"> </el-option>
            <el-option label="2028-2029" value="2028-2029"> </el-option>
            <el-option label="2029-2030" value="2029-2030"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="term" :label-width="formLabelWidth">
          <el-select v-model="myCourseVo.term" placeholder="请选择学期">
            <el-option label="上学期" value="上学期"> </el-option>
            <el-option label="下学期" value="下学期"> </el-option>
          </el-select>
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
    return {
      dialogFormVisible: false,
      formLabelWidth: "100px",
      myCourseVos: [],
      myCourseVo: {
        id: 0,
        userinfoId: 0,
        year: "",
        term: "",
        courseIds: [],
        depart: "",
        major: "",
      },
      courses: [],
      majors: [],
      departs: [],
      rules: {
        
        year: [{ required: true, message: "必填项", trigger: "blur" }],
        term: [{ required: true, message: "必填项", trigger: "blur" }],
        courseIds: [
          { type: "array", required: true, message: "必填项", trigger: "blur" },
        ],
        depart: [{ required: true, message: "必填项", trigger: "blur" }],
        major: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "teacher"]),
  },
  created() {
    if (process.client) {
      //this.sch=this.$lodash.cloneDeep(this.school) 深度拷贝
      this.$nextTick(() => {
        // this.user = this.$lodash.cloneDeep(this.userinfo);
        // this.teacherInfo = this.$lodash.cloneDeep(this.teacher);

        this.getDepartsForSelect(this.school.id);
      });
    }
  },

  methods: {
    async getCoursesByDepartAndMajor(depart, major, school) {
      let res = await this.$axios({
        url: "api/course/getCoursesBySchoolAndDepartAndMajorForSelect",
        params: {
          school: school,
          depart: depart,
          major: major,
        },
      });
      if (res.success) {
        this.myCourseVos = res.data.myCourseVos;
      } else {
        this.$message.error("no data");
        return false;
      }
    },
    async getDepartsForSelect(schoolId) {
      let res = await this.$axios({
        url: "api/department/getDepartsForSelectByTypeAndSchoolId",
        params: {
          type: "学院",
          schoolId: schoolId,
        },
      });
      if (res.success) {
        this.departs = res.data.departments;
      } else {
        this.$message.error("no data");
        return false;
      }
    },
    async selectDepart(departName) {
      let res = await this.$axios({
        url: "api/major/getMajorsForSelectByDepart",
        params: {
          depart: departName,
        },
      });
      if (res.success) {
        this.majors = res.data.majors;
      } else {
        this.$message.error("no data");
        return false;
      }
    },
    async selectMajor(majorName) {
      let res = await this.$axios({
        url: "api/course/getCoursesBySchoolAndDepartAndMajorForSelect",
        params: {
          school: this.school.schoolName,
          depart: this.myCourseVo.depart,
          major: majorName,
        },
      });
      if (res.success) {
        this.courses = res.data.courses;
      } else {
        this.$message.error("no data");
        return false;
      }
    },
    toAdd() {
      this.dialogFormVisible = true;
    },
    toEdit(id) {
      this.dialogFormVisible = true;
    },
     submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.myCourseVo.userinfoId=this.userinfo.id;
            this.myCourseVo.courseIds=this.myCourseVo.courseIds.join(',');
          
            this.addOrUpdate(this.myCourseVo);
          
          } else {
            this.$message.error("输入参数无效")
            return false;
          }
        });
      },
     async  addOrUpdate(myCourseVo,formName){
        let res=await this.$axios({
          url:'api/userCourse/saveOrUpdate',
          method:'post',
          data:myCourseVo
        })
        if(res.success){
          this.$message.success(res.msg);
          this.$refs[formName].resetFields();
          this.dialogFormVisible=false;
        }
        else{
          this.$message.error(res.msg);
          return false;
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
.user-course-list {
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>