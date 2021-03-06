import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Authentication from './views/Authentication.vue'
import Search from './views/Search.vue'
import User from './views/User.vue'
import Profile from './views/Profile.vue'
import UserTripDetailed from './views/UserTripDetailed.vue'
import UpcomingTrips from './views/UpcomingTrips.vue'
import UpcomingTripDetailed from './views/UpcomingTripDetailed.vue'
import CreateTrip from './views/CreateTrip.vue'
import DiscoverView from './views/DiscoverView.vue'

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
    },
    {
      path: '/my-profile',
      name: 'user',
      component: User
    },
    {
      path: '/my-profile/:name-Page',
      name: 'profile',
      component: Profile,
      props: true
    },
    {
      path: '/profile/:id',
      name: 'foreignProfile',
      component: Profile,
      props: true
    },
    {
      path: '/my-profile/trip-to-:destination-:tripId',
      name: 'userTripDetailed',
      component: UserTripDetailed,
      props: true
    },
    {
      path: '/upcoming-trips',
      name: 'upcoming',
      component: UpcomingTrips
    },
    {
      path: '/upcoming-trips/trip-to-:destination-:tripId',
      name: 'upcomingTripDetailed',
      component: UpcomingTripDetailed,
      props: true
    },
    {
      path: '/create-trip',
      name: 'createTrip',
      component: CreateTrip
    },
    {
      path: '/discover-destination',
      name: 'discoverView',
      component: DiscoverView
    }
  ]
})
