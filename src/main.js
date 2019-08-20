import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false
// 安装其他插件的时候，可以直接在 main.js 中引入并使用 Vue.use()来注册，但是 axios并不是vue插件，所以不能 使用Vue.use()，所以只能在每个需要发送请求的组件中即时引入。
Vue.use(ElementUI)
// 每次都引入axios很麻烦 优化 在vue原型上添加$axios方法
Vue.prototype.$axios = axios
// 配置axios基准地址 baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 每次请求都带上token 很麻烦 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送之前做点啥
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做点啥
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
