<template>
  <div class="images">
    <div class="upload">
      <el-upload
        class="upload-demo"
        accept=".xlsx,.xls"
        action="actinUrl"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success="onImportExcelSuccess"
        :http-request="handleUplaodTeacher"
      >
        <el-button size="small" type="primary">导入教师信息</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx,xls文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      fileList: [],
    };
  },
  computed: {
    ...mapState(["userinfo", "imageTypes"]),
  },
  created() {
    if (process.client) {
      this.eNames = this.imageTypes;
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    onImportExcelSuccess(res, file, fileList) {
      if (res.success) {
        this.fileList = [];
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleUplaodTeacher(obj) {
      let params = new FormData();
      params.append("file", obj.file);
      this.$axios({
        url: "api/upload/importTeachersByExcel",
        method: "post",
        data: params,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          obj.onSuccess(res);
        })
        .catch((err) => {
          this.$message.error("文件上传错误");
          return false;
        });
    },
  },
};
</script>

<style  scoped>
.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>>

