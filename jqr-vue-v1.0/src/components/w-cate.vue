<template>
  <div class="my-cate">
    <div class="cates">
      <span
        class="cate"
        @click="sendCateId(item.id)"
        v-for="item in cates"
        :key="item.id"
      >
        {{ item.cat_name }}
      </span>
      <span class="cate"></span>
      <span class="cate"></span>
      <div class="edit">
        <i class="el-icon-s-promotion" style="font-size: 18px"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cates: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    sendCateId(id) {
      this.$emit("getcateid", id);
    },
  },
};
</script>

<style scoped>

 .my-cate{
    position: fixed;
    top: 0;
    left: 0;
    height: 50px;
    z-index: 9999;
    background-color:white;
    width: 100%; 
    
} 
.cates {
  height: 50px;
  line-height: 50px;
  white-space: nowrap;
  overflow-x: scroll;
  border-bottom: 1px solid #ccc;
}
.cate {
  padding: 0 10px;
}
.edit {
  width: 48px;
  height: 48px;

  top: 1px;
  right: 0;
  position: fixed;
  background-color: white;
  display: block;
  justify-content: center;
  align-items: center;
}
</style>