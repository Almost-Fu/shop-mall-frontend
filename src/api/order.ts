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

/** 更新订单状态（发货/完成/取消） */
export function updateOrderStatus(id: number, status: string): Promise<Order> {
  return request<Order>({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/** 我的订单（按用户名查询） */
export function getMyOrders(username: string): Promise<Order[]> {
  return request<Order[]>({
    url: '/orders/my',
    method: 'get',
    params: { username }
  })
}
