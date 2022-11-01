import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import A from '../views/A.vue'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  name: 'Home',
  components: {
    default: Home,
    A: A
  }
},
{
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
},
{
  path: '/me',
  name: 'Me',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/Me.vue')
},
{
  // 动态路径参数 以冒号开头
  path: '/user/:id(\\d+)',
  name: 'user',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../components/User.vue')
},
{
  // 动态路径参数 以冒号开头
  path: '*',
  name: '404',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
