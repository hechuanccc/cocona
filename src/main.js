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
import Vue2Filters from 'vue2-filters'
import { gethomePage, setCookie } from './api'
import qs from 'qs'
import icon from './utils/icon'
import { msgFormatter } from './utils'
import color from './style'

let url = window.location.href
const HTTPS = process.env.HTTPS
if (HTTPS && HTTPS.replace(/"/g, '') === '1') {
  if (window.location.protocol === 'http:') {
    window.location.replace(url.replace(/http:/, 'https:'))
  }
}
let params = qs.parse(url.slice(url.indexOf('?') + 1, url.length))
if (params.r) {
  setCookie('r=' + params.r).catch(() => {})
}

Vue.use(require('vue-moment'))
Vue.use(Vue2Filters)
Vue.use(VueI18n)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueCookie)
Vue.use(Vuex)

const store = createStore()
const token = Vue.cookie.get('access_token')

Vue.config.productionTip = false

Object.keys(locales).forEach(lang => {
  Vue.locale(lang, locales['cn'])
})

if (token) {
  axios.defaults.withCredentials = true
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

axios.interceptors.request.use((config) => {
  axios.defaults.withCredentials = true
  let t = new Date()
  config.headers.common['x-sign'] = icon[color.white](t, icon.sz)
  config.headers.common['x-date'] = icon[color.red.split('5')[0]](t, icon.sz)
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(res => {
  let responseData = res.data

  if (responseData.code === 2000) {
    return responseData.data
  } else if (responseData.code === 9001) {
    return responseData
  } else {
    if (responseData.code === 9007) {
      toHomeAndLogin(router)
    }
    return Promise.reject(responseData)
  }
}, (error) => {
  Vue.prototype.$message({
    showClose: true,
    message: msgFormatter(error) || Vue.t('message.error'),
    type: 'error'
  })
  toHomeAndLogin(router)
  return Promise.reject(error)
})

const toHomeAndLogin = function (router) {
  store.commit('RESET_USER')
  router.push({
    path: '/',
    query: {
      login: 1,
      next: router.path
    }
  })

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

router.afterEach(function (to) {
  const gaTrackingId = store.state.systemConfig.gaTrackingId
  if (gaTrackingId) {
    window.gtag('config', store.state.systemConfig.gaTrackingId, {page_path: to.path})
  }
})

sync(store, router)

Vue.mixin({
  methods: {
    performLogin () {
      toHomeAndLogin(this.$router)
    },
    clearSpace (form, key) {
      form[key] = form[key].replace(/\s+/g, '')
    }
  }
})

gethomePage().then(
  response => {
    let pref = response.global_preferences || {}
    store.dispatch('setSystemConfig',
      {
        homePageLogo: response.icon,
        customerServiceUrl: pref.customer_service_url,
        agentDashboardUrl: pref.agent_dashboard_url,
        global_preferences: pref,
        agentBusinessConsultingQQ: pref.agent_business_consulting_qq,
        contactEmail: pref.contact_email,
        contactPhoneNumber: pref.contact_phone_number,
        openAccountConsultingQQ: pref.open_account_consulting_qq,
        siteName: response.name,
        floatAd: response.right_float_img,
        chatroomEnabled: pref.chatroom_enabled === 'true',
        gaTrackingId: pref.ga_tracking_id,
        favicon: response.favicon,
        regPresentAmount: response.reg_present_amount,
        needBankinfo: response.need_bankinfo,
        envelopeSettings: pref.red_envelope_settings,
        sms_validation_enabled: pref.sms_validation_enabled
      })

    if (pref.ga_tracking_id) {
      const ga = document.createElement('script')
      ga.type = 'text/javascript'
      ga.async = true
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${pref.ga_tracking_id}`
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(ga, s)
    }
    if (pref.script_content) {
      const dynamicScript = document.createElement('script')
      dynamicScript.type = 'text/javascript'
      dynamicScript.async = true
      dynamicScript.text = `try{${pref.script_content}}catch(e){console.log(e)}`
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(dynamicScript, s)
    }
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
