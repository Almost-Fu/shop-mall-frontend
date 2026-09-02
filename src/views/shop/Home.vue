<template>
  <div class="home">
    <!-- Banner -->
    <div class="banner">
      <h1>ShopMall 商城</h1>
      <p>Vue3 + TypeScript + Element Plus 前后端分离演示项目</p>
      <el-button type="primary" size="large" @click="router.push('/goods')">
        去逛逛 →
      </el-button>
    </div>

    <!-- 分类快捷入口 -->
    <div class="categories container">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category"
        @click="goCategory(cat.id)"
      >
        {{ cat.name }}
      </div>
    </div>

    <!-- 热销商品 -->
    <div class="container section">
      <h3 class="section-title">🔥 热销推荐</h3>
      <el-row :gutter="16">
        <el-col
          v-for="p in products"
          :key="p.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
        >
          <ProductCard :product="p" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList, getCategories } from '@/api/goods'
import type { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])

onMounted(async () => {
  const [productData, categoryData] = await Promise.all([
    getProductList({ page: 1, pageSize: 6 }),
    getCategories()
  ])
  products.value = productData.list
  categories.value = categoryData
})

function goCategory(id: number) {
  router.push({ path: '/goods', query: { categoryId: id } })
}
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  color: #fff;
  text-align: center;
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
}
.banner::before,
.banner::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}
.banner::before {
  width: 300px;
  height: 300px;
  top: -120px;
  left: -60px;
}
.banner::after {
  width: 200px;
  height: 200px;
  bottom: -80px;
  right: 10%;
}
.banner h1 {
  font-size: 44px;
  margin-bottom: 12px;
  letter-spacing: 2px;
}
.banner p {
  opacity: 0.92;
  margin-bottom: 28px;
  font-size: 16px;
}
.categories {
  display: flex;
  gap: 16px;
  margin-top: -28px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
  padding: 0 16px;
}
.category {
  flex: 1;
  min-width: 120px;
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  font-weight: 600;
  transition: all 0.25s ease;
}
.category:hover {
  color: var(--brand);
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
}
.section {
  margin-top: 40px;
  margin-bottom: 40px;
}
.section-title {
  margin-bottom: 18px;
  font-size: 22px;
  position: relative;
  padding-left: 14px;
}
.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 20px;
  background: var(--brand-gradient);
  border-radius: 4px;
}
.section :deep(.el-col) {
  margin-bottom: 16px;
}
</style>
