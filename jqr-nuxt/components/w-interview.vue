<template>
  <div class="interviews">
    <div
      class="interview"
      v-for="item in interviews"
      :key="item.id"
      @click="sendInteviewId(item.id)"
      :style="{ height: height + 'px' }"
    >
      <div class="title">
        {{ item.title }}
      </div>

      <div class="create-time">{{ item.createTime|timeFormat}}</div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
export default {
  props: {
    interviews: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      default: 50,
    },
  },
  filters:{
    timeFormat(value){
      return dayjs(value).format('YYYY/MM/DD');
    }
  },
  methods:{
      sendInteviewId(id){
          this.$emit('getInterviewId',id);
      }
  }
};
</script>

<style scoped>
.interviews {
  margin-top: 10px;
}
.interview {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
}
</style>