import { request } from '@/utils/request'
import type { LoginParams, LoginResult, RegisterParams, UserInfo } from '@/types'

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

export function register(data: RegisterParams): Promise<UserInfo> {
  return request<UserInfo>({
    url: '/auth/register',
    method: 'post',
    data
  })
}
