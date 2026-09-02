import { request } from '@/utils/request'
import type { Order } from '@/types'

/**
 * 订单相关接口
 */
export function getOrders(): Promise<Order[]> {
  return request<Order[]>({
    url: '/orders',
    method: 'get'
  })
}

export function createOrder(data: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'>): Promise<Order> {
  return request<Order>({
    url: '/orders',
    method: 'post',
    data
  })
}
