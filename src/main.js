// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import VueSession from 'vue-session'
// import Pusher from 'vue-pusher'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/engine.scss'
import './style.scss'

Vue.use(VueMaterial)
Vue.use(VueSession)
Vue.use(require('vue-pusher'), {
  api_key: '5db59e0050361fadf97d',
  options: {
    cluster: 'ap2',
    encrypted: true
  }
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAE6M9oEbsYCS7XPPaqE8Cwe5QzlTsrrms'
    // libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    // If you want to set the version, you can do so:
    // v: '3.26',
  }})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
