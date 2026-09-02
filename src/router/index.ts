import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

/**
 * 路由表
 * 前台（商城）：login / home / goods / goods/:id / cart
 * 后台（管理）：admin 目录下的页面，需 admin 角色
 */

const router = createRouter({
  // 使用 hash 模式，便于纯静态部署（刷新不 404）
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/layouts/ShopLayout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/shop/Home.vue'),
          meta: { title: '商城首页' }
        },
        {
          path: 'goods',
          name: 'GoodsList',
          component: () => import('@/views/shop/GoodsList.vue'),
          meta: { title: '商品列表' }
        },
        {
          path: 'goods/:id',
          name: 'GoodsDetail',
          component: () => import('@/views/shop/GoodsDetail.vue'),
          meta: { title: '商品详情' }
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('@/views/shop/Cart.vue'),
          meta: { title: '购物车', requiresAuth: true }
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { title: '数据看板', requiresAdmin: true }
        },
        {
          path: 'goods',
          name: 'GoodsManage',
          component: () => import('@/views/admin/GoodsManage.vue'),
          meta: { title: '商品管理', requiresAdmin: true }
        },
        {
          path: 'orders',
          name: 'OrdersManage',
          component: () => import('@/views/admin/OrdersManage.vue'),
          meta: { title: '订单管理', requiresAdmin: true }
        },
        {
          path: 'users',
          name: 'UsersManage',
          component: () => import('@/views/admin/UsersManage.vue'),
          meta: { title: '用户管理', requiresAdmin: true }
        }
      ]
    }
  ]
})

/**
 * 全局前置守卫：角色鉴权
 * - 需要登录的页面（购物车）：未登录跳转登录页
 * - 后台页面：必须是 admin 角色，普通 user 拦截
 * 注意：这里只做"路由级"权限判断，账号密码校验在 mock 接口层。
 */
router.beforeEach((to) => {
  const userStore = useUserStore()

  // 需要 admin 角色的后台路由
  if (to.meta.requiresAdmin) {
    if (!userStore.isLoggedIn) {
      ElMessage.warning('请先登录管理员账号')
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    if (userStore.role !== 'admin') {
      ElMessage.error('无权访问后台，仅管理员可进入')
      return { path: '/home' }
    }
  }

  // 需要登录的路由（购物车）
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
