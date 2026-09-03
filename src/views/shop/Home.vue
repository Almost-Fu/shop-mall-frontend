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

    <!-- 后端加载提示（免费实例休眠/冷启动时显示） -->
    <div v-if="showTip" class="backend-tip">
      <el-alert type="warning" :closable="false" show-icon>
        <template #title>后端服务启动中，首次加载可能需要 30~60 秒</template>
        <p>
          免费云服务空闲后会进入休眠，第一次打开需要等后端启动完成后才有数据。
          请点击下方按钮重试，或稍等片刻后刷新页面。
        </p>
        <el-button type="primary" size="small" :loading="loading" @click="loadData">
          重新加载
        </el-button>
      </el-alert>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList, getCategories } from '@/api/goods'
import type { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const loadError = ref(false)
const loaded = ref(false)

onMounted(loadData)

async function loadData() {
  loading.value = true
  loadError.value = false
  try {
    const [productData, categoryData] = await Promise.all([
      getProductList({ page: 1, pageSize: 6 }),
      getCategories()
    ])
    products.value = productData.list
    categories.value = categoryData
  } catch {
    // 后端可能处于休眠冷启动，标记为错误并提示
    loadError.value = true
    products.value = []
    categories.value = []
  } finally {
    loading.value = false
    loaded.value = true
  }
}

// 提示条件：请求失败，或加载完成但数据为空（后端可能还没就绪）
const showTip = computed(
  () =>
    loadError.value ||
    (loaded.value && products.value.length === 0 && categories.value.length === 0)
)

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
.backend-tip {
  max-width: 1200px;
  margin: 20px auto 0;
  padding: 0 16px;
}
.backend-tip p {
  margin: 6px 0 12px;
  font-size: 14px;
  color: #8a6d3b;
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
