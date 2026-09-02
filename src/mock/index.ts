import type { AxiosResponse, AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import type { ApiResult, PageResult, Product, LoginParams, LoginResult, Order, AdminUser } from '@/types'
import { mockCategories, mockProducts, mockUsers, mockOrders, mockAccounts } from './data'

/**
 * Mock 适配器
 * 原理：实现 axios 的自定义 adapter，拦截请求并按 url/method 返回虚拟数据。
 * 好处：API 层、组件层完全无感知；对接真实后端时把环境变量
 * VITE_USE_MOCK 改为 false 即可，无需改动任何业务代码。
 */

/** 统一成功响应包装 */
function ok<T>(data: T): ApiResult<T> {
  return { code: 0, message: 'success', data }
}

/** 统一失败响应包装 */
function fail(message: string, code = 1): ApiResult<null> {
  return { code, message, data: null }
}

/** 构造 axios 响应对象 */
function buildResponse(config: InternalAxiosRequestConfig, body: unknown): AxiosResponse {
  return {
    data: body,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {}
  }
}

/** 模拟网络延迟 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 解析 URL 中的查询参数 */
function parseQuery(config: InternalAxiosRequestConfig): Record<string, string> {
  const params = new URLSearchParams(config.url?.split('?')[1] || '')
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/** 获取 URL 路径（去掉 query） */
function getPath(config: InternalAxiosRequestConfig): string {
  return config.url?.split('?')[0] || ''
}

/**
 * Mock 路由处理表
 * 注意：这里的校验逻辑（账号密码、权限）都只属于 mock 层，
 * 页面组件不包含任何账号判断逻辑。
 */
async function handle(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  await delay(300)

  const method = (config.method || 'get').toLowerCase()
  const path = getPath(config)
  const query = parseQuery(config)
  const body = (config.data ? JSON.parse(config.data) : {}) as Record<string, unknown>

  // ===== 登录 =====
  if (method === 'post' && path === '/auth/login') {
    const { username, password } = body as unknown as LoginParams
    const account = mockAccounts.find((a) => a.username === username && a.password === password)
    if (!account) {
      return buildResponse(config, fail('账号或密码错误'))
    }
    const result: LoginResult = {
      token: account.token,
      user: {
        id: account.id,
        username: account.username,
        nickname: account.nickname,
        role: account.role
      }
    }
    return buildResponse(config, ok(result))
  }

  // ===== 分类列表 =====
  if (method === 'get' && path === '/categories') {
    return buildResponse(config, ok(mockCategories))
  }

  // ===== 商品分页列表 =====
  if (method === 'get' && path === '/goods/list') {
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 8)
    const keyword = query.keyword || ''
    const categoryId = Number(query.categoryId || 0)

    let list = [...mockProducts]
    if (keyword) {
      list = list.filter((p) => p.name.includes(keyword))
    }
    if (categoryId) {
      list = list.filter((p) => p.categoryId === categoryId)
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize)
    const result: PageResult<Product> = { list: pageList, total, page, pageSize }
    return buildResponse(config, ok(result))
  }

  // ===== 商品详情 =====
  if (method === 'get' && path === '/goods/detail') {
    const id = Number(query.id)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      return buildResponse(config, fail('商品不存在'))
    }
    return buildResponse(config, ok(product))
  }

  // ===== 订单列表（后台） =====
  if (method === 'get' && path === '/orders') {
    return buildResponse(config, ok(mockOrders))
  }

  // ===== 创建订单 =====
  if (method === 'post' && path === '/orders') {
    const data = body as unknown as Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'>
    const order: Order = {
      ...data,
      id: Date.now(),
      orderNo: 'NO' + Date.now(),
      status: '待付款',
      createTime: new Date().toLocaleString('zh-CN')
    }
    mockOrders.unshift(order)
    return buildResponse(config, ok(order))
  }

  // ===== 用户列表（后台） =====
  if (method === 'get' && path === '/users') {
    return buildResponse(config, ok(mockUsers))
  }

  // ===== 未匹配到的接口 =====
  return buildResponse(config, fail(`Mock 未实现接口: ${method.toUpperCase()} ${path}`))
}

/** 导出的 mock adapter */
export const mockAdapter: AxiosAdapter = async (config) => {
  return handle(config)
}
