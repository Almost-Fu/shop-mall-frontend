import { request } from '@/utils/request'
import type { Product, ProductQuery, PageResult, Category, ProductForm } from '@/types'

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

/** 新增商品（上架） */
export function createProduct(data: ProductForm): Promise<Product> {
  return request<Product>({
    url: '/goods',
    method: 'post',
    data
  })
}

/** 编辑商品 */
export function updateProduct(id: number, data: ProductForm): Promise<Product> {
  return request<Product>({
    url: `/goods/${id}`,
    method: 'put',
    data
  })
}

/** 删除商品（下架） */
export function deleteProduct(id: number): Promise<boolean> {
  return request<boolean>({
    url: `/goods/${id}`,
    method: 'delete'
  })
}
