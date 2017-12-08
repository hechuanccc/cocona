// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import locales from './i18n/locales'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Icon from 'vue-awesome/components/Icon'
import Vue2Filters from 'vue2-filters'

Vue.component('icon', Icon)
Vue.use(require('vue-moment'))
Vue.use(Vue2Filters)
Vue.use(VueI18n)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueCookie)
Vue.use(VueI18n)
Vue.use(Vuex)

Vue.config.productionTip = false

let navLang = navigator.language || navigator.userLanguage
if (navLang === 'zh-CN' || navLang === 'zh-cn') {
  Vue.config.lang = 'cn'
} else if (navLang === 'en-US' || navLang === 'en-us') {
  Vue.config.lang = 'en'
} else {
  Vue.config.lang = 'cn'
}

Object.keys(locales).forEach(lang => {
  Vue.locale(lang, locales[lang])
})

const store = createStore()

const token = Vue.cookie.get('access_token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

router.beforeEach((to, from, next) => {
  // fisrMacthed might be the top-level parent route of others
  const firstMatched = to.matched.length ? to.matched[0] : null
  if ((to || firstMatched).meta.requiresAuth) {
    store.dispatch('fetchUser')
      .then(res => {
        next()
      })
      .catch(error => {
        store.commit('SHOW_LOGIN_DIALOG')
        return Promise.resolve(error)
      })
  } else {
    next()
  }
})

sync(store, router)

Vue.mixin({
  methods: {
    performLogin () {
      this.$router.push({
        path: '/',
        query: {
          login: 1,
          next: this.$route.path
        }
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
