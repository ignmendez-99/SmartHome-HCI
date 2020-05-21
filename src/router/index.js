import Vue from 'vue'
import VueRouter from 'vue-router'
import Tutorial from '../views/newUserWelcomeTutorial.vue'
import MyDevices from '../views/myDevices.vue'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/devices',
    name: 'MyDevices',
    component: MyDevices
  },
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: Tutorial
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
