import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/auth'
import type { LoginParams, UserInfo, Role } from '@/types'

/**
 * 用户状态：登录信息、角色
 * 说明：账号密码校验逻辑在后端，这里只保存登录结果，不写死任何账号判断。
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') as UserInfo | null
  }),

  getters: {
    /** 是否已登录 */
    isLoggedIn: (state) => !!state.token,
    /** 当前角色 */
    role: (state): Role => state.userInfo?.role || 'user'
  },

  actions: {
    /** 登录：调用登录接口，保存 token 和用户信息 */
    async login(params: LoginParams) {
      const result = await loginApi(params)
      this.token = result.token
      this.userInfo = result.user
      localStorage.setItem('token', result.token)
      localStorage.setItem('userInfo', JSON.stringify(result.user))
      return result.user
    },

    /** 退出登录 */
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})
