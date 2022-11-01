<template>
  <div class="courses">
       <div class="course first" :style="{ height: height + 'px', width: width + 'px' }">
        <span>请先选择课程</span>
    </div>
    <div
      class="course"
      v-for="(item, index) in courses"
      :key="item.id"
      :class="{ active: currentIndex == index }"
      :style="{ height: height + 'px', width: width + 'px' }"
      @click="sendCourseAndIndex(index,item.id)"
    >
      <span>{{ item.name }}</span>
    </div>
   
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 200,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    sendCourseAndIndex(index,courseId) {
      let obj={index,courseId};
      this.$emit('getCourseAndIndex',obj)
    },
  },
};
</script>

<style scoped>
.courses {
  display: flex;
  margin-bottom: 10px;
}
.course {
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
}
</style>