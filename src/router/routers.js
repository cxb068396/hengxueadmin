import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    //component: (resolve) => require(['@/views/login'], resolve),
    component:()=>import('../views/login'),
    hidden: true
  },
  {
    path: '/404',
   // component: (resolve) => require(['@/views/features/404'], resolve),
    component:()=>import('../views/features/404'),
    hidden: true
  },
  {
    path: '/401',
   // component: (resolve) => require(['@/views/features/401'], resolve),
   component:()=>import('../views/features/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
       component:()=>import('../views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component:()=>import('../views/Home'),
        name: 'Dashboard',
        hidden: false,
        meta: { title: '首页', icon: 'hx-home', affix: true, noCache: true }
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'center',
  //     component:()=>import('../views/system/user/center'),
  //       name: '个人中心',
  //       meta: { title: '个人中心' }
  //     }
  //   ]
  // }
]

export default new Router({
   mode: 'hash',
 // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
