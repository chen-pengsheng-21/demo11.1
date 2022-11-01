<template>
  <!-- 底部导航 -->
  <div class="tabbars">
    <div
      class="tabbar"
      v-for="(tabbar, index) in tabbars"
      :key="index"
      @click="toJump(index, tabbar.path)"
    >
      <div class="tabbar-icon">
        <img
          :src="tabbar.active ? tabbar.selectedIcon : tabbar.icon"
          width="25px"
          height="25px"
        />
      </div>
      <div class="tabbar-name" style="fontsize: 8px">
        {{ tabbar.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "w-tabbar",
  props: {
    tabbars: {
      type:Array,
      require: true,
      validator: function (value) {
        return value.length>=2&&value.length<=5
      },
    },
  },
  data() {
    return {};
  },
 
  methods: {
    toJump(index, path) {
      let data = {
        index: index,
        path: path,
      };

      this.$emit("jump", data);//data 可选
    },
  },
};
</script>

<style scoped>
.tabbars {
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  height: 50px;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 999;
}
.tabbar-name {
  text-align: center;
}
</style>