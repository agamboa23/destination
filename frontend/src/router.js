import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Authentication from './views/Authentication.vue'
import Search from './views/Search.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Authentication,
      props: { type: 'login' }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Authentication,
      props: { type: 'signup' }
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
