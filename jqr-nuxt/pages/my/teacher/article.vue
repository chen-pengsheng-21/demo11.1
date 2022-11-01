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
            ><a href="/my/doc/article">我的文章</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
         <div class="username">{{ teacher ? teacher.teacherName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName:'' }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="doc-add">
        <h3>文章列表</h3>
        <el-button type="primary" icon="el-icon-plus" @click="articleAdd"
          >新建</el-button
        >
      </div>
      <div class="article-list">
        <el-card class="article-card" v-for="article in articles" :key="article.id">
          <div slot="header" class="clearfix">
            <span>{{article.title}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toEdit(article.id)">编辑</el-button>
          </div>
          <div class="bottom clearfix">
            <time class="time">{{ article.updateTime|dateFormat }}</time>
            <el-tag type='warning' v-if="article.courseId>0">{{article.courseName}}</el-tag> <el-tag type='info' v-if="article.userArticleCatId>0">{{article.catName}}</el-tag> <el-tag type='success' >{{article.open===1?'公开':'私有'}}</el-tag>
          </div>
        </el-card>
      </div>
    </el-main>
    <!-- 文章编辑dialog -->
    <el-dialog
      title="文章编辑"
      :visible.sync="dialogArticleVisible"
      :center="true"
      width="80%"
    >
      <el-form :model="article" ref="articleForm" :rules="rules">
        <el-form-item
          prop="userArticleCatId"
          label="文章分类"
          label-width="100px"
        >
          <el-radio-group v-model="article.userArticleCatId">
            <el-radio-button
              v-for="cat in myArticleCats"
              :key="cat.id"
              :label="cat.id"
              >{{ cat.catName }}</el-radio-button
            >
          </el-radio-group>
          <el-button
            type="info"
            icon="el-icon-plus"
            @click="selectArticleCat"
          ></el-button>
        </el-form-item>
        <el-form-item prop="courseId" label="我的课程" label-width="100px">
          <el-radio-group v-model="article.courseId">
            <el-radio-button
              v-for="course in myCourses"
              :key="course.id"
              :label="course.id"
              >{{ course.name }}</el-radio-button
            >
          </el-radio-group>
          <el-button
            type="info"
            icon="el-icon-plus"
            @click="selectCourse"
          ></el-button>
        </el-form-item>
        <el-form-item label="文章标题" label-width="100px">
          <el-form-item prop="title">
            <el-input
              v-model="article.title"
              placeholder="请输入文章标题"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="open" label="公开？" label-width="100px">
          <el-radio-group v-model="article.open">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="0">私有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="content" label-width="0">
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="article.content"
              ref="md"
            />
          </client-only>
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-button type="primary" @click="onArticleSubmit('articleForm')"
              >保存</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 文章分类编辑dialog -->
    <el-dialog
      title="选择文章分类"
      :visible.sync="dialogArticleCatVisible"
      :center="true"
    >
      <el-checkbox-group v-model="checkedArticleCats">
        <template v-for="cat in articleCats">
          <el-checkbox-button
            v-if="cat.showInNav == 1"
            :label="cat.id"
            :key="cat.id"
            >{{ cat.catName }}</el-checkbox-button
          >
        </template>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogArticleCatVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmArticleCats">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 文章课程编辑dialog -->
    <el-dialog
      title="选择课程"
      :visible.sync="dialogCourseVisible"
      :center="true"
    >
      <div class="course">
        <el-form
          :model="course"
          :rules="courseRules"
          ref="courseForm"
          class="demo-ruleForm"
        >
          <el-col :span="7">
            <el-form-item prop="depart">
              <el-select
                v-model="course.depart"
                placeholder="请选择学院"
                @change="selectDeaprt"
              >
                <el-option
                  v-for="depart in departs"
                  :key="depart.id"
                  :label="depart.departName"
                  :value="depart.departName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="major">
              <el-select v-model="course.major" placeholder="请选择专业">
                <el-option
                  v-for="major in majors"
                  :key="major.id"
                  :label="major.majorName"
                  :value="major.majorName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="name">
              <el-input
                v-model="course.name"
                placeholder="请输入你的课程名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              type="danger"
              icon="el-icon-search"
              @click.prevent="searchCourses('courseForm')"
            ></el-button>
          </el-col>
        </el-form>
        <div class="coursesCheckboxList">
          <el-checkbox-group v-model="checkedCourses">
            <template v-for="course in courses">
              <el-checkbox-button :label="course.id" :key="course.id"
                >{{ course.name }}
              </el-checkbox-button>
            </template>
          </el-checkbox-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCourseVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCourses">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from 'dayjs';
export default {
  layout: "my",
  data() {
    return {
      dialogArticleVisible: false,
      dialogArticleCatVisible: false,
      dialogCourseVisible: false,
      articles: [],
      articleCats: [], //文章分类
      checkedArticleCats: [], //我选择文章分类
      myArticleCats: [], //我的文章的分类
      courses: [], //课程
      myCourses: [], //我上过的课程
      checkedCourses: [], //我选的课程
      article: {
        id: 0,
        userArticleCatId: 0,
        title: "",
        content: "",
        courseId: 0,
        open: 1,
      },
      rules: {
        title: [
          {
            required: true,
            message: "必填项",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "必填项",
            trigger: "blur",
          },
        ],
      },
      course: {
        school: "",
        depart: "",
        major: "",
        name: "",
      },

      courseRules: {
        depart: [{ required: true, message: "必填项", trigger: "blur" }],
        major: [{ required: true, message: "必填项", trigger: "blur" }],
        name: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      departs: [],
      majors: [],
      user: {},
      handbook: "#### 你在岁月静好,我在负重前行",
       page: {
        current: 1,
        size: 0,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption", "school","teacher"]),
  },
  created() {
    if (process.client) {
      this.user = this.userinfo;
      this.getDeparts(this.school.id);
      this.getArticlesByUserId(this.user.id, 1);
      this.$axios
        .all([
          this.getUserCourses(this.user.id),
          this.getUserArticleCat(this.user.id),
        ])
        .then((res) => {
          if (res[0].success) {
            this.myCourses = res[0].data.courses;
            this.myCourses.forEach((element) => {
              this.checkedCourses.push(element.id);
            });
          }
          if (res[1].success) {
            this.myArticleCats = res[1].data.articleCats;
            this.myArticleCats.forEach((element) => {
              this.checkedArticleCats.push(element.id);
            });
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    }
  },

  methods: {
    articleAdd() {
      this.dialogArticleVisible = !this.dialogArticleVisible;

    },
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.memorabilia.userId = this.user.id;
          let res = await this.$axios({
            url: "api/memorabilia/add",
            method: "post",
            data: this.memorabilia,
          });
          if (res.success) {
            this.$refs[formName].resetFields();
            this.$message.success(res.msg);
            getMemorabiliasByUserId(this.user.id);
          } else {
            this.$message.error(res.msg);
            this.$refs[formName].resetFields();
            return;
          }
        } else {
          this.$message.error("表单验证错误");
          return;
        }
      });
    },
    async getArticleCats() {
      let res = await this.$axios({
        url: "api/articleCat/getArticleCatForSelect",
      });
      if (res.success) {
        this.articleCats = res.data.articleCats;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    selectCourse() {
      this.dialogCourseVisible = !this.dialogCourseVisible;
    },
    selectArticleCat() {
      this.dialogArticleCatVisible = !this.dialogArticleCatVisible;

      this.getArticleCats();
    },
    async confirmArticleCats() {
      let articleCats = this.checkedArticleCats;
      if (articleCats.length == 0) {
        this.$message.error("至少选择一个文章分类");
        return;
      }
      //
      let userArticleCat = {
        userArticleCatIds: articleCats.join(","),
        userId: this.user.id,
      };
      let res = await this.$axios({
        url: "api/userArticleCat/saveOrUpdate",
        method: "post",
        data: userArticleCat,
      });
      if (res.success) {
        this.getUserArticleCat(this.user.id)
          .then((res) => {
            if (res.success) {
              this.myArticleCats = res.data.articleCats;
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
        this.dialogArticleCatVisible = false;
        this.$message.success(`添加文章分类${res.msg}`);
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    async confirmCourses() {
      let courses = this.checkedCourses;
      if (courses.length == 0) {
        this.$message.error("至少选择一门课程");
        return;
      }
      let userCourse = {
        userinfoId: this.user.id,
        courseIds: courses.join(","),
      };

      let res = await this.$axios({
        url: "api/userCourse/saveOrUpdate",
        method: "post",
        data: userCourse,
      });
      if (res.success) {
        this.getUserCourses(this.user.id)
          .then((res) => {
            if (res.success) {
              this.myCourses = res.data.courses;
              this.dialogCourseVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
    },
    getUserArticleCat(userId) {
      return this.$axios({
        url: "api/userArticleCat/getArticleCatsForSelectByUserId",
        params: {
          userId: userId,
        },
      });
    },
    getUserCourses(userId) {
      return this.$axios({
        url: "api/userCourse/getCourseForSelectByUserId",
        params: {
          userId: userId,
        },
      });
    },

    async getDeparts(schoolId) {
      let res = await this.$axios({
        url: "api/department/getDepartsForSelectBySchoolId",
        params: {
          schoolId: schoolId,
        },
      });
      if (res.success) {
        this.departs = res.data.departments;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    selectDeaprt(depart) {
      this.getMajors(depart);
    },
    async getMajors(depart) {
      let res = await this.$axios({
        url: "api/major/getMajorsForSelectByDepart",
        params: {
          depart: depart,
        },
      });
      if (res.success) {
        this.majors = res.data.majors;
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    searchCourses(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //模糊查询课程
          this.course.school = this.school.schoolName;

          let res = await this.$axios({
            url: "api/course/getCoursesBySDMForSelect",
            method: "post",
            data: this.course,
          });

          if (res.success) {
            this.courses = res.data.courses;
          } else {
            this.$message.error(res.msg);
            return false;
          }
        } else {
          this.$message.error("数据校验错误");
          return false;
        }
      });
    },
    onArticleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //默认值
          //自定义mybatis 方法,mybatis-plus默认方法不生效
          this.article.createTime = new Date();
          this.article.updateTime = new Date();
          this.article.deleted = 0;
          let userArticle = {
            article: this.article,
            userId: this.user.id,
          };
          let res = await this.$axios({
            url: "api/userArticle/add",
            method: "post",
            data: userArticle,
          });
          if (res.success) {
             this.getArticlesByUserId(this.user.id,this.page.current);
             this.$refs[formName].resetFields();
            this.$message.success(res.msg);
            this.dialogArticleVisible = false;
          } else {
            this.$message.error(res.msg);
            return;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getArticlesByUserId(userId, current) {
      let data = {
        current: current,
        userId: userId,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/userArticle/page/getArticleWithCourseAndCatVo",
        method: "post",
        data: data,
      });
      if(res.success){
        let page=res.data.page;
        this.articles=page.records
        this.page=page;
      }
      else{
        this.$message.error(res.msg);
      }
    },
    toEdit(articleId){
      this.dialogArticleVisible=true;
      this.getArticleById(articleId);
    },
    async getArticleById(id){
      let res=await this.$axios({
        url:'api/article/one',
        params:{
          id:id
        }
      })
      if(res.success){
        
        this.article=res.data.article;
      }
      else{
        this.$message.error(res.msg);
      }

    }
  },
  filters:{
    dateFormat(value){
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss');   
    }
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
.course {
  min-height: 100px;
}
.article-card{
  margin-top: 10px;
}
</style>