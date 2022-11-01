<template>
  <div class="cell">
      <div class="title">{{title}}</div>
      <i class="icon" :class="icon"></i>
  </div>
</template>

<script>
export default {
    name:'w-cell',
    props:{
        icon:{
            type:String,
            default:'el-icon-arrow-right'
        },
        title:{
            type:[String,Number],
            default:'默认标题'
        }
    }

}
</script>

<style>
.cell{
    display: flex;
    justify-content: center;
    align-items: center;
}
.title{
    text-align: left;
    flex: 4;
}
.icon{
    text-align: right;
    flex: 1;
}
</style>