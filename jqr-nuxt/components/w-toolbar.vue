<template>
  <div class="w-toolbars">
      <div 
      class="toolbar" 
      v-for="toolbar in toolbars.list" 
      :key="toolbar.id" 
      @click="tojump(toolbar.url)"
      :style="{height:toolbars.height+'px',width:toolbars.width+'px'}"
      >
          <div class="toolbar-icon">
              <img class="img" :src="toolbar.imgicon" alt="" srcset="" v-if="toolbar.imgicon.length!=0">
              <el-badge :value="toolbar.count" class="item"  v-else>
              <i class="icon" :class="toolbar.icon" ></i>
              </el-badge>
          </div>
          <div class="toolbar-name">{{toolbar.name}}</div>
      </div>
  </div>
</template>

<script>
export default {
    name:'toolbars',
    props:{
        toolbars:Object,
        required:true
    },
    methods:{
        tojump(url){
            this.$router.push(url);
        }
    }

}
</script>

<style scoped>
.w-toolbars{
    display: flex;
    justify-content: space-between;

}
.toolbar{
    display: flex;
    justify-content: center;
    align-items: center;
    /* width: 250px;
    height: 100px; */
    border: 1px solid #ccc;
    border-radius:10px ;
}
.toolbar-icon .icon{
    font-size: 40px;
}
.item {
  margin-top: 10px;
  margin-right: 20px;
}
.toolbar-name{
    font-size: 32px;
}
</style>