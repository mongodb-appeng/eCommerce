import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ConfirmEmail from './views/Confirm.vue'
import Register from './views/Register.vue'
import UserProfile from './views/UserProfile.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: ConfirmEmail,
      props: true
    },
    {
      path: '/register',
      name: 'register',
      component: Register, 
      props: true
    },    {
      path: '/profile',
      name: 'profile',
      component: UserProfile, 
      props: true
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
