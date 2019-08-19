import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'index'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    }
  ]
})
// 在axios发送成功时 ，把token 存储到本地localStorage中
// 设置拦截守卫 from 不能不写
// to 到哪去 from从哪来
// next是否放行 next()放行 next('/login)拦截到登录
// 如果时要去登录，不需要拦截
// 如果已经登录过了， 有了token不拦截
// 如果不是去登录，并且没有token，拦截到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
