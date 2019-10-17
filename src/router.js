import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ConfirmEmail from './views/Confirm.vue'
import Register from './views/Register.vue'
// import UserProfile from './views/UserProfile.vue'
import UserAccount from './views/UserAccount.vue'
import Product from './views/Product.vue'
import Basket from './views/Basket.vue'
import Checkout from './views/Checkout.vue'
import CheckedOut from './views/CheckedOut.vue'

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
    }, 
    {
      path: '/account',
      name: 'account',
      component: UserAccount, 
      props: true
    },
    {
      path: '/product',
      name: 'product',
      component: Product, 
      props: true
    },
    {
      path: '/basket',
      name: 'basket',
      component: Basket, 
      props: true
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout, 
      props: true
    },
    {
      path: '/checkedout',
      name: 'checkedout',
      component: CheckedOut, 
      props: true
    }
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
