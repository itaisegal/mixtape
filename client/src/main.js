// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(VueSocketio, socketio('http://localhost:3000'), store);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
