import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
// 导入全局样式
import "./assets/css/global.css"

// 将axios挂载到原型中
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 添加拦截器
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token")
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
