import { request } from '@/utils/request'
import type { LoginParams, LoginResult } from '@/types'

/**
 * 认证相关接口
 */
export function login(data: LoginParams): Promise<LoginResult> {
  return request<LoginResult>({
    url: '/auth/login',
    method: 'post',
    data
  })
}
