import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
// 导入全局样式
import "./assets/css/global.css"
// 引入树形表格插件
import ZkTable from "vue-table-with-tree-grid"
// 引入时间过滤器
import filters from "./store/timefilter"
// 引入文本编辑器
import VueQuillEditor from "vue-quill-editor"
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'// for bubble theme
// 导入进度条nprogress js和css
import NProgress from 'nprogress'
import "nprogress/nprogress.css"


Vue.use(VueQuillEditor)

// 时间过滤器的使用
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 使用vue注册插件
Vue.component('tree-table', ZkTable)

// 将axios挂载到原型中
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 添加拦截器
// 在request拦截器中展示进度条 NProgress.start() 
axios.interceptors.request.use(config => {
  console.log(config);
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem("token")
  // 在最后必须return config
  return config
})
// 在response 拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios;


Vue.use(ElementUI);
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
