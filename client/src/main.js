// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
// import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.config.productionTip = false
// Vue.use(VueYouTubeEmbed)
Vue.use(VueSocketio, socketio('https://mixtape-app.herokuapp.com'), store,{transports: ['websocket']});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
