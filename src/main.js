import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'
import axios from 'axios'

import permission from "@/utils/permission"

import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker);
Vue.prototype.$http = axios

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
// Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

import EventCenter from "@/utils/EventCenter";
Vue.prototype.$bus = new Vue

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
