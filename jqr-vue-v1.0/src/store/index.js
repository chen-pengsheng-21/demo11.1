import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
import home from "@/assets/tabbar/home.png";
import my from "@/assets/tabbar/my.png";
import home_active from "@/assets/tabbar/home-active.png";
import my_active from "@/assets/tabbar/my-active.png";
import seach from "@/assets/tabbar/seach.png";
import list from "@/assets/tabbar/list.png";
import seach_active from "@/assets/tabbar/seach-active.png";
import list_active from "@/assets/tabbar/list-active.png";
export default new Vuex.Store({
  state: {
    $token: '',
    $userInfo: null,
    $preRoute: '/',
    $tabbars: [{
      name: "首页",
      icon: home,
      selectedIcon: home_active,
      path: "/",
      active: true,
    },
    {
      name: "列表",
      icon: list,
      selectedIcon: list_active,
      path: "/my",
      active: false,
    },
    {
      name: "搜索",
      icon: seach,
      selectedIcon: seach_active,
      path: "/",
      active: false,
    },
    {
      name: "我的",
      icon: my,
      selectedIcon: my_active,
      path: "/my",
      active: false,
    },
    ],
  },
  getters: {
  },
  mutations: {
    setToken(state, token) {
      state.$token = token
    },
    setUserInfo(state, userInfo) {
      state.$userInfo = userInfo
    },
    setHasLogin(state, hasLogin) {
      state.$hasLogin = hasLogin;
    },
    setPreRoute(state, route) {
      state.$preRoute = route;
    }
  },
  actions: {
  },


  modules: {
  }
})