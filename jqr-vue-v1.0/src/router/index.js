import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: ()=>import('@/views/home/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('@/views/home/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: ()=>import('@/views/home/register.vue')
  },
  {
    path: '/my',
    name: 'my',
    component: ()=>import('@/views/my/index.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
