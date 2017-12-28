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
import { gethomePage } from './api'
import qs from 'qs'

let url = window.location.href
let params = qs.parse(url.slice(url.indexOf('?') + 1, url.length))
if (params.r) {
  let expires = new Date()
  expires.setMonth(expires.getMonth() + 1)
  VueCookie.set('r', params.r, {expires: expires})
}

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
  axios.defaults.withCredentials = true
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}
axios.interceptors.response.use(res => {
  let responseData = res.data
  if (responseData.code === 2000) {
    return responseData.data
  } else {
    if (responseData.code === 9007) {
      toHomeAndLogin(router)
    }
    return Promise.reject(responseData.msg)
  }
}, (error) => {
  Vue.prototype.$message({
    showClose: true,
    message: Vue.t('message.error'),
    type: 'error'
  })
  toHomeAndLogin(router)
  return Promise.reject(error)
})

const toHomeAndLogin = function (router) {
  router.push({
    path: '/',
    query: {
      login: 1,
      next: router.path
    }
  })

  store.dispatch('logout')
  store.commit('SHOW_LOGIN_DIALOG')
}

router.beforeEach((to, from, next) => {
  // fisrMacthed might be the top-level parent route of others
  const firstMatched = to.matched.length ? to.matched[0] : null
  if ((firstMatched || to).meta.requiresAuth) {
    if (from && from.matched[0] && from.matched[0].path === to.matched[0].path) {
      next()
    } else {
      store.dispatch('fetchUser')
        .then(res => {
          // got user info
          if (res.account_type === 0 && to.matched[0].path === '/account') {
            toHomeAndLogin(router)
          } else {
            next()
          }
        })
        .catch(error => {
          // can't get user info
          toHomeAndLogin(router)
          return Promise.resolve(error)
        })
    }
  } else {
    next()
  }
})

sync(store, router)

Vue.mixin({
  methods: {
    performLogin () {
      toHomeAndLogin(this.$router)
    }
  }
})

gethomePage().then(
  response => {
    store.dispatch('setCommon',
      {
        homePageLogo: response.icon,
        customerServiceUrl: response.global_preferences.customer_service_url
      })
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
