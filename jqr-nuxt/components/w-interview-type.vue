<template>
  <div class="interview-types">
    <div class="interview-type first"
      :style="{ height: height + 'px', width: width + 'px' }"
    >
      <span>面试题型</span>
    </div>
    <div
      class="interview-type"
      v-for="(item, index) in interviewTypes"
      :key="item.id"
      :class="{ active: currentIndex == index }"
      :style="{ height: height + 'px', width: width + 'px' }"
      @click="sendInterviewTypesAndIndex(index, item.id)"
    >
      <span>{{ item.typeName }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    interviewTypes: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 100,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    sendInterviewTypesAndIndex(index, interviewTypeId) {
      let obj = { index, interviewTypeId };
      this.$emit("getInterviewTypesAndIndex", obj);
    },
  },
};
</script>

<style scoped>
.interview-types {
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.interview-type{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #eee;
  background-color: #409EFF;
  color: white;
}
.first{
    background-color:#E6A23C;
    color: white;
}

.active {
  background-color: #ccc;
  border: 1px solid #ccc;
  width: 120px;
}
</style>