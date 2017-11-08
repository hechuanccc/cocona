// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
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

Vue.use(require('vue-moment'))
Vue.use(VueI18n)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueCookie)
Vue.use(VueI18n)

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
    }
  }
})
