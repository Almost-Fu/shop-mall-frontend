import { defineStore } from 'pinia'
import type { CartItem, Product } from '@/types'

/**
 * 购物车状态（本地持久化）
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
  }),

  getters: {
    /** 购物车商品总数量 */
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.count, 0),
    /** 勾选商品的总价 */
    checkedPrice: (state) =>
      state.items.filter((i) => i.checked).reduce((sum, i) => sum + i.price * i.count, 0),
    /** 勾选的商品 */
    checkedItems: (state) => state.items.filter((i) => i.checked)
  },

  actions: {
    /** 保存到 localStorage */
    persist() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    /** 加入购物车 */
    addToCart(product: Product, count = 1) {
      const exist = this.items.find((i) => i.productId === product.id)
      if (exist) {
        exist.count += count
      } else {
        this.items.push({
          id: product.id,
          productId: product.id,
          name: product.name,
          cover: product.cover,
          image: product.image,
          price: product.price,
          count,
          stock: product.stock,
          checked: true
        })
      }
      this.persist()
    },

    /** 修改数量 */
    updateCount(productId: number, count: number) {
      const item = this.items.find((i) => i.productId === productId)
      if (item && count >= 1) {
        item.count = count
        this.persist()
      }
    },

    /** 删除 */
    removeFromCart(productId: number) {
      this.items = this.items.filter((i) => i.productId !== productId)
      this.persist()
    },

    /** 切换勾选 */
    toggleChecked(productId: number) {
      const item = this.items.find((i) => i.productId === productId)
      if (item) {
        item.checked = !item.checked
        this.persist()
      }
    },

    /** 全选 / 取消全选 */
    toggleAll(checked: boolean) {
      this.items.forEach((i) => (i.checked = checked))
      this.persist()
    },

    /** 清空已结算的商品 */
    clearChecked() {
      this.items = this.items.filter((i) => !i.checked)
      this.persist()
    }
  }
})
