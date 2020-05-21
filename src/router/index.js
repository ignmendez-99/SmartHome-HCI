import Vue from 'vue'
import VueRouter from 'vue-router'
import Tutorial from '../views/newUserWelcomeTutorial.vue'
import MyDevices from '../views/myDevices.vue'
import Index from '../views/Index.vue'
import SignUp from '../views/signUp.vue'
import LogIn from '../views/logIn.vue'

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
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/logIn',
    name: 'LogIn',
    component: LogIn
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
