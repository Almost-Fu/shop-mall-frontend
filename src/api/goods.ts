import { request } from '@/utils/request'
import type { Product, ProductQuery, PageResult, Category } from '@/types'

/**
 * 商品相关接口
 */
export function getProductList(params: ProductQuery): Promise<PageResult<Product>> {
  return request<PageResult<Product>>({
    url: '/goods/list',
    method: 'get',
    params
  })
}

export function getProductDetail(id: number): Promise<Product> {
  return request<Product>({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function getCategories(): Promise<Category[]> {
  return request<Category[]>({
    url: '/categories',
    method: 'get'
  })
}
