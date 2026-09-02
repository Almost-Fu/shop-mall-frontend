import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResult } from '@/types'
import { mockAdapter } from '@/mock'

/**
 * 统一 axios 实例
 * - baseURL 从环境变量读取（业务组件禁止硬编码接口地址）
 * - VITE_USE_MOCK=true 时使用 Mock 适配器，false 时走真实后端
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 启用 Mock 时挂载自定义适配器
if (import.meta.env.VITE_USE_MOCK === 'true') {
  service.defaults.adapter = mockAdapter
}

// ===== 请求拦截器：自动携带 token =====
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== 响应拦截器：统一解包 ApiResult，处理错误 =====
service.interceptors.response.use(
  (response: AxiosResponse<ApiResult<unknown>>) => {
    const res = response.data
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    // 直接返回业务数据，调用处无需再 .data
    return res.data as never
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
      window.location.hash = '#/login'
    } else {
      ElMessage.error(error.message || '网络错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default service

/**
 * 泛型请求工具：让调用处获得正确的返回值类型
 */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as unknown as Promise<T>
}
