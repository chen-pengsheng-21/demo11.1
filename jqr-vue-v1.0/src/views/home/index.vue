<template>
  <div class="home">
    <w-cate :cates="cates" @getcateid="getCateId"></w-cate>
    <w-pull-refresh @refresh="refresh">
      <div class="articles">
        <div v-if="articles.length == 0">no data</div>
        <div
          v-else
          class="article"
          v-for="article in articles"
          :key="article.id"
          @click="toArticleDetal(article.id)"
        >
          {{ article.title }}
        </div>
      </div>
    </w-pull-refresh>
    <w-tabbar :tabbars="$tabbars" @jump="jump"></w-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src
import wTabbar from "@/components/w-tabbar.vue";
import { getNoParam, get } from "@/utils/request.js";
import WCate from "@/components/w-cate.vue";
import wPullRefresh from "@/components/w-pull-refresh.vue";
import { mapState } from "vuex";
// import WArticles from '@/components/w-articles.vue';
export default {
  name: "HomeView",
  data() {
    return {
      cates: [],
      articles: [],
      countPrePage: 20,
      currentPage: 1,
    };
  },
  components: {
    wTabbar,
    WCate,
    wPullRefresh,
    // WArticles
  },
  created() {
    //在页面渲染之前加载数据
    this.getCates();
    this.getArticlesPage(this.countPrePage, this.currentPage);
  },
  computed: {
    ...mapState(["$tabbars"]),
  },
  methods: {
    jump(data) {
      let { index, path } = data;
      this.changeActive(index);
      this.$router.push(path);
    },
    changeActive(ids) {
      this.$tabbars.forEach((item, index) => {
        if (ids != index) {
          item.active = false;
        } else {
          item.active = true;
        }
      });
    },
    getCateId(id) {
      //获取文章信息
      //cat_id
      console.log(id);
      this.getArticlesByCatId(id);
    },
    async getCates() {
      let result = await getNoParam("/api/articlecate/getmobilearticlecates");
      console.log(result);
      if (result != undefined) {
        this.cates = result.rows;
      }
    },
    async getArticlesPage(countPrePage, currentPage) {
      let params = {
        countPerPage: countPrePage,
        currentPage: currentPage,
      };
      let result = await get("api/article/getAllArticle", params);
      console.log(result);

      if (result.code == 1) {
        let articles = result.data.rows;
        articles.forEach((article) => {
          this.articles.unshift(article);
        });
      }
    },
    async getArticlesByCatId(id) {
      let params = {
        cat_id: id,
      };
      let result = await get("api/articles/catid", params);
      console.log(result);
      if (result.code == 1) {
        this.articles = result.data;
      }
    },
    toArticleDetal(id) {
      console.log("文章的编号", id);
      //跳转到articledeatail页面
      this.$router.push({ path: "articledetail", query: { id: id } });
      //要把文章编号query传参到articledeatail页面
    },
    refresh() {
      this.currentPage++;
      this.getArticlesPage(this.countPrePage, this.currentPage);
    },
  },
};
</script>
<style scoped>
.articles {
  margin-top: 50px;
  margin-bottom: 50px;
}
.article {
  border-bottom: 1px solid #ccc;
  text-align: left;
}
</style>
