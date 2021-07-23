import Vue from "vue";
import VueRouter from "vue-router";
const home = () => import("../components/home.vue");
const login = () => import("../components/login.vue");

Vue.use(VueRouter)
const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/home",
    component: home
  },
  {
    path: "/login",
    component: login
  }
]

const router = new VueRouter({
  routes,
  mode: "history"
})

// 挂在导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径 from从哪一个路径跳转过来 next 放行 next("/ ")强制跳转的路径
  // 将token与导航守卫结合实现权限控制 如果访问login界面直接放行，如果访问其他界面则判断有没有token
  if (to.path == "/login") return next()
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next("/login")
  next()
})

export default router