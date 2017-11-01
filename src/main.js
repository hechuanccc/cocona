// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(require('vue-moment'))
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueCookie)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // fisrMacthed might be the top-level parent route of others
  const firstMatched = to.matched.length ? to.matched[0] : null
  if (to.meta.requiresAuth || firstMatched.meta.requiresAuth) {
    const token = Vue.cookie.get('access_token')
    if (!token) {
      return next('/')
    }
  }
  next()
})

const store = createStore()
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    const token = Vue.cookie.get('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      this.$store.dispatch('fetchUser')
    }
  }
})
