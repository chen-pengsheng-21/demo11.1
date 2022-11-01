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
            ><a href="/admin/school/depart">广告类型管理</a></el-breadcrumb-item
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
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="ads" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
         <el-table-column prop="adUrl" label="广告地址" width="100">
          <template
            slot-scope="scope"
            style="
              height: 100px;
              display: flex;
              justify-content: center;
              align-content: center;
            "
          >
            <img
              :src="scope.row.adUrl"
              width="50"
              height="50"
              :title="scope.row.name"
            />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="广告内容"> </el-table-column>

        <el-table-column prop="adHref" label="超链接"> </el-table-column>
        <el-table-column prop="target" label="广告位置" width="100">
        </el-table-column>
        <el-table-column prop="adStyle" label="广告样式" width="100">
        </el-table-column>
        <el-table-column prop="adCateId" label="广告分类">
          <template slot-scope="scope">
            <el-select
              v-model="ads[scope.$index]['adCateId']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in adCates"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="adType" label="广告类型"> 
          <template slot-scope="scope">
            <el-select
              v-model="ads[scope.$index]['adType']"
              placeholder="请选择"
            >
              <el-option label="文字" :value="0"> </el-option>
              <el-option label="图片" :value="1"> </el-option>
              <el-option label="视频" :value="2"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="激活" width="100">
          <template slot-scope="scope">
            <el-select
              v-model="ads[scope.$index]['enable']"
              placeholder="请选择"
            >
              <el-option label="激活" :value="1"> </el-option>
              <el-option label="失效" :value="0"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
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

    <el-dialog title="广告编辑" width="80%" :visible.sync="dialogFormVisible">
      <el-form :model="ad" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="广告位置"
          prop="target"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ad.target"
            autocomplete="off"
            placeholder="请输入广告位置：广告放置的具体位置"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告样式"
          prop="adStyle"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ad.adStyle"
            type="textarea"
            autocomplete="off"
            placeholder="广告的文本样式"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告连接"
          prop="adUrl"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ad.adUrl"
            autocomplete="off"
            placeholder="请输入广告连接:图片地址或者视频地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告超链接"
          prop="adHref"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="ad.adHref"
            autocomplete="off"
            placeholder="请输入广告连接，连接到站内竞赛，文章的路径.没有填写:#"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告分类" :label-width="formLabelWidth">
          <el-form-item prop="adCateId">
            <el-select v-model="ad.adCateId" placeholder="请选择广告分类">
              <el-option
                v-for="item in adCates"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="广告类型" :label-width="formLabelWidth">
          <el-form-item prop="adType">
            <el-select v-model="ad.adType" placeholder="请选择部门类型">
              <el-option label="文字" :value="0"> </el-option>
              <el-option label="图片" :value="1"> </el-option>
              <el-option label="视频" :value="2"> </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="是否激活" :label-width="formLabelWidth">
          <el-form-item prop="enable">
            <el-select v-model="ad.enable" placeholder="请选择是否激活">
              <el-option label="激活" :value="1"> </el-option>
              <el-option label="失效" :value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item
          label="广告内容"
          prop="content"
          :label-width="formLabelWidth"
        >
          <client-only>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="ad.content"
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
      handbook: "",
      dialogFormVisible: false,
      ads: [],
      adCates: [],
      ad: {
        id: 0,
        adCateId:1,
        content: "",
        adType: 1, //图片
        enable: 1,
        target: "",
        adStyle: "",
        schoolId: 1,
        addUrl: "",
        adHref:''
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      rules: {
        content: [{ required: true, message: "必填项", triggle: "blur" }],
        adCateId: [
          {
            type: "number",
            required: true,
            message: "必填项",
            triggle: "blur",
          },
        ],
        target: [
          {
            required: true,
            message: "必填项",
            triggle: "blur",
          },
        ],
        adUrl: [{ required: true, message: "必填项", triggle: "blur" }],
        adHref: [{ required: true, message: "必填项", triggle: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption", "school"]),
  },
  created() {
    if (process.client) {

      this.getAdsByPageAndSchoolId(1,this.school.id);
      this.getAdCatesForSelect();
    }
  },
  methods: {
    async getAdCatesForSelect() {
      let arr = ["id", "name"];
      const res = await this.$axios({
        url: "api/adcate/columns?columns=" + arr,
      });
      if(res.success){
        this.adCates=res.data.adCates;
      }
      else{
        this.$message.error(res.msg)
        return false;
      }
    },
    async getAdsByPageAndSchoolId(current, schoolId) {
      let schoolPage = {
        schoolId: schoolId,
        current: current,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/ad/page/school",
        method:'post',
        data: schoolPage,
      });
      if (res.success) {
        let page = res.data.page;
        this.page=page;
        this.ads=page.records;

      } else {
        this.$message.error(res.msg);
      }
    },

    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页
    handleCurrentChange(val) {
      this.page.current = val;
      this.getAdsByPageAndSchoolId(val,this.school.id);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ad.id == 0) {
            this.ad.schoolId=this.school.id;
            this.$axios({
              url: "api/ad/add",
              method: "post",
              data: this.ad,
            })
              .then((res) => {
                if (res.success) {
                  this.getAdsByPageAndSchoolId(this.page.current,this.school.id);
                  this.dialogFormVisible = false;
                } else {
                  this.$message.error(res.msg)
                  return false;
                }
              })
              .catch((err) => {
                this.$message.error(err)
                this.dialogFormVisible = false;
                return false;
              });
          } else {
            this.$axios({
              url: "/api/ad/edit",
              method: "post",
              data: this.ad,
            })
              .then((res) => {
                if (res.success) {
                   this.getAdsByPageAndSchoolId(this.page.current,this.school.id);
                  this.dialogFormVisible = false;
                } else {
                 this.$message.error(res.msg)
                  return false;
                }
              })
              .catch((err) => {
                this.$message.error(err)
                this.dialogFormVisible = false;
                return false;
              });
          }
        } else {
          return false;
        }
      });
    },

    toAdd() {
      let   ad= {
        id: 0,
        adCateId: 1,
        content: "",
        adType: 1, //图片
        enable: 1,
        target: "",
        adStyle: "",
        schoolId: 1,
        adUrl: "",
        adHref:'',
      };
      this.ad = ad;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getAd(id);
    },

   async getAd(id) {
      this.$axios({
        url: "api/ad/one",
        method: "get",
        params: {
          id: id,
        },

      })
        .then((res) => {
          if (res.success) {
            this.ad = res.data.ad;
          } else {
            this.$message({
              message: res.msg,
              center: true,
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err,
            center: true,
          });
        });
    },
  }
};
</script>

<style>
</style>