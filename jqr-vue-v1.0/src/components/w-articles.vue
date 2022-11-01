<template>
  <div class="articles">
      <div class="article" v-for="article in articles" :key="article.id">
          {{article.title}}
      </div>
  </div>
</template>

<script>
export default {
    props:{
        articles:{
            type:Array,
            require:true
        }
    },
    data(){
        return{

        }
    }

}
</script>

<style scoped>
.articles{
    
}
.article{
    border-bottom: 1px solid #ccc;
    text-align: left;
}
</style>