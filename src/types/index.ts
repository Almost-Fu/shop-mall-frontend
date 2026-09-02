/**
 * 全局类型定义
 * 前后端分离：这些类型对应后端接口返回的数据结构
 */

/** 商品分类 */
export interface Category {
  id: number
  name: string
}

/** 商品 */
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  cover: string
  categoryId: number
  categoryName: string
  stock: number
  sales: number
  description: string
}

/** 商品查询参数 */
export interface ProductQuery {
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 购物车条目 */
export interface CartItem {
  id: number
  productId: number
  name: string
  cover: string
  price: number
  count: number
  stock: number
  checked: boolean
}

/** 用户角色：admin 管理员 / user 普通用户 */
export type Role = 'admin' | 'user'

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  role: Role
  avatar?: string
}

/** 登录参数 */
export interface LoginParams {
  username: string
  password: string
}

/** 登录结果（对接真实后端时 token 由后端下发） */
export interface LoginResult {
  token: string
  user: UserInfo
}

/** 订单状态 */
export type OrderStatus = '待付款' | '待发货' | '已发货' | '已完成' | '已取消'

/** 订单 */
export interface Order {
  id: number
  orderNo: string
  username: string
  items: { name: string; price: number; count: number }[]
  totalPrice: number
  status: OrderStatus
  createTime: string
}

/** 后台管理的用户记录 */
export interface AdminUser {
  id: number
  username: string
  nickname: string
  role: Role
  createTime: string
}

/** 统一接口返回结构 */
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}
