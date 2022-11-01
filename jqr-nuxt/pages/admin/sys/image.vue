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
            ><a href="/admin/sys/image"> </a
          ></el-breadcrumb-item>
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

      <el-table :data="images" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="imgUrl" label="图片路径" width="100">
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
              :src="scope.row.imgUrl"
              width="50"
              height="50"
              :title="scope.row.name"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="图片名称"> </el-table-column>
        <el-table-column prop="width" label="宽度" width="80">
        </el-table-column>
        <el-table-column prop="height" label="高度" width="80">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="copyBloard(scope)"
              >图片路径复制</el-button
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
    </el-main>
    <el-dialog title="图片编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="image" ref="form" :rules="rules" status-icon>
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="image.name"
            autocomplete="off"
            placeholder="请输入图片名称"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="图片路径"
          prop="chager"
          :label-width="formLabelWidth"
        >
          <el-col :span="0">
            <el-form-item prop="imgUrl">
              <el-input type="hidden" v-model="image.imgUrl"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 120px" v-if="image.imgUrl">
            <el-image
              style="width: 100px; height: 100px"
              :src="image.imgUrl"
              :fit="fit"
            ></el-image>
          </el-col>
          <el-col
            :span="6"
            style="
              height: 100px;
              display: flex;
              justify-content: flex-start;
              align-content: center;
            "
          >
            <el-button
              type="danger"
              icon="el-icon-plus"
              @click="addImg(image.id, image.imgUrl)"
              >添加图片</el-button
            >
          </el-col>
        </el-form-item>
        <el-form-item label="宽度|高度" :label-width="formLabelWidth">
          <el-col :span="6">
            <el-input type="number" v-model="image.width"></el-input>
          </el-col>
          <el-col style="width: 50px"> 宽度 </el-col>
          <el-col :span="6">
            <el-input type="number" v-model="image.height"></el-input>
          </el-col>
          <el-col style="width: 50px"> 高度 </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="图片添加" width="60%" :visible.sync="dialogImagVisible">
      <w-image
        @getuploadimgresult="getuploadimgresult"
        :imageName="imageName"
        :imageUrl="imageUrl"
        :imageId="imageId"
      ></w-image>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

import wImage from "@/components/w-image.vue";
export default {
  layout: "my",
  data() {
    return {
      images: [],
      imageId: 0,
      imageName: "",
      imageUrl: "",
      formLabelWidth: "100px",
      dialogFormVisible: false,
      dialogImagVisible: false,
      fit: "cover",
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      image: {
        id: 0,
        imgUrl: "",
        name: "",
        width: "",
        height: "",
      },
      rules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        imgUrl: [
          { required: true, message: "必填项", trigger: "blur" },
          { type: "url", message: "图片的地址必须正确", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  components: {
    wImage,
  },
  created() {
    if (process.client) {
      this.getImagesPage(1);
    }
  },
  methods: {
    async getImagesPage(current) {
      let colums = ["id", "img_url", "name", "width", "height"];
      let page = {
        current: current,
        size: 10,
        colums: colums,
      };

      let res = await this.$axios({
        url: "/api/image/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.images = page.records;
        this.page = page;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });
        return false;
      }
    },
    async getImageById(id) {
      let res = await this.$axios({
        url: "/api/image/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.image = res.data.image;
        this.imageId = this.image.id;
        this.imageName = this.image.name;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });
        this.dialogFormVisible = false;
        return false;
      }
    },
    getuploadimgresult(result) {
      this.image = result;
      this.dialogImagVisible = !this.dialogFormVisible;
    },
    toAdd() {
      let image = {
        id: 0,
        imgUrl: "",
        name: "",
        width: "",
        height: "",
      };
      this.image = image;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.getImageById(id);
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    addImg(id, imageUrl) {
      if (id > 0) {
        this.imageId = id;
        this.imageUrl = imageUrl;
      }
      this.dialogImagVisible = !this.dialogImagVisible;
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getImagesPage(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.image.id == 0) {
            this.$axios({
              url: "/api/image/add",
              method: "post",
              data: this.image,
            })
              .then((res) => {
                if (res.success) {
                  this.getImagesPage(this.page.current);
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
              url: "/api/image/edit",
              method: "post",
              data: this.image,
            })
              .then((res) => {
                if (res.success) {
                  this.getImagesPage(this.page.current);
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
   async copyBloard(imageUrl) {
      try {
        await this.$copyText(imageUrl.row.imgUrl);
      } catch (e) {
        this.$message.error("复制失败")
      }
    },
  },
};
</script>

<style scoped>
.e {
  justify-content: center;
  align-content: center;
}
</style>