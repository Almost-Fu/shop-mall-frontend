import { request } from '@/utils/request'
import type { AdminUser } from '@/types'

/**
 * 用户管理接口（后台）
 */
export function getUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>({
    url: '/users',
    method: 'get'
  })
}
