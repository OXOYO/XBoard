import Vue from 'vue'
import moment from 'moment'
import * as Cookies from 'js-cookie'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import './registerServiceWorker'

import utils from './global/utils'
import components from './global/components'
import config from './config'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/styles/main.less'

// Vue 全局配置
let isDev = process && process.env.NODE_ENV !== 'production'
Vue.config.debug = isDev
Vue.config.devtools = isDev
Vue.config.productionTip = isDev
Vue.config.performance = isDev

// 挂载 $X 命名空间
Vue.prototype.$X = {
  isDev,
  utils,
  config,
  moment,
  Cookies
}

// i18n实例
const i18nInstance = i18n(Vue)

// 注册ui
Vue.use(iView, {
  // transfer: true,
  // FIXME 修复$Modal弹窗报错BUG，【Issues】https://github.com/iview/iview/issues/4769#issuecomment-449851416
  i18n: (path, options) => i18nInstance.t(path, options)
})
// 注册全局组件
Vue.use(components)

new Vue({
  i18n: i18nInstance,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
