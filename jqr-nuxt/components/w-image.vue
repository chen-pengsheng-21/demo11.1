<template>
  <div class="images">
    <div class="upload" >
      <el-upload
        class="avatar-uploader"
        action="actionUrl"
        :headers="{ token: myToken }"
        :limit="1"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUplaodImage"
         ref="upload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    imageId: {
      type: Number,
      default: 0,
    },
    imageName:{
      type:String,
    },
    imageUrl:{
      type:String
    }
  },
  data() {
    return {

      image: {
        imgUrl: "",
        name:'',
        width: 0,
        height: 0,
      },
      eNames: [],

      myToken: "",
    };
  },
  computed: {
    ...mapState(["userinfo", "imageTypes"]),
  },
  created() {
    if (process.client) {
      this.myToken = this.userinfo.token;
      this.eNames = this.imageTypes;
    }
  },
  methods: {
    handleAvatarSuccess(res, file,fileList) {
      if (res.success) {
        let img = new Image();
        img.src = res.data.imgPath;
        this.image.imgUrl = res.data.imgPath;
        this.image.id = this.imageId;
        this.image.name=this.imageName;
        img.onload = (res1) => {
          this.image.width = res1.path[0].width;
          this.image.height = res1.path[0].height;
        };
        this.$emit("getuploadimgresult", this.image);
        this.$refs.upload.clearFiles();

      } else {
        this.$message.error(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      console.log(this.eNames);
      const isJPG = this.eNames.includes(file.type);

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpg,png,gif,jpeg 等格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isJPG && isLt2M;
    },
    handleUplaodImage(obj){
     
      let params=new FormData();
      params.append('file',obj.file);
      this.$axios({
        url:'api/upload/img',
        method:'post',
        data:params,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res=>{
        obj.onSuccess(res);
      })
      
    }
  },
};
</script>

<style  scoped>
.avatar-uploader {
  border: 1px solid #d9d9d9;
}
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
</style>>

