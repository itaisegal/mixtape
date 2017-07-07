import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Station from '../components/Station'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/:stationId',
      name: 'Station',
      component: Station
    }
  ]
})
