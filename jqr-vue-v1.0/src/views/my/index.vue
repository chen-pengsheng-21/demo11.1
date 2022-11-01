<template>
  <div class="my">
    <div class="my-header">
      <i class="el-icon-s-home home" @click="toJumpHome"></i>
      <i class="el-icon-s-tools setting" @click="toJumpInfo"></i>
    </div>
    <div class="my-logo">
      <img height="50px" width="50px" src="../../assets/ai.png" alt="" />
      <div>{{$userInfo.userName}}</div>
    </div>
    <el-divider></el-divider>
    <div class="my-body">
      <w-cell title="读书笔记" @click.native="toJumpArticle"></w-cell>
      
    </div>
  </div>
</template>

<script>
import wCell from "@/components/w-cell.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["$userInfo"]),
  },
  components: {
    wCell,
  },
  methods: {
    toJumpHome() {
      this.$router.replace("/");
    },
    toJumpInfo() {
      // /my/info
      //params
      //query
      this.$router.push({path:"/my/info",query:{id:this.$userInfo.id}});
    },
    toJumpArticle() {
     
      this.$router.push("/my/article");
    },
  },
};
</script>

<style scoped>
.my-header {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.my-logo {
  height: 100px;
  display: flex;
  justify-content:flex-start;
  align-items: center;
  padding-left: 50px;
}
.home,
.setting {
  position: absolute;
  top: 10px;
}
.home {
  left: 10px;
}
.setting {
  right: 10px;
}
</style>