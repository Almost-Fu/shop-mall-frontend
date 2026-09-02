<template>
  <div class="goods-list container">
    <!-- 筛选区 -->
    <div class="filters">
      <el-radio-group v-model="categoryId" @change="handleSearch">
        <el-radio-button :value="0">全部</el-radio-button>
        <el-radio-button v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 商品网格 -->
    <el-empty v-if="!loading && products.length === 0" description="暂无商品" />
    <el-row v-else :gutter="16">
      <el-col
        v-for="p in products"
        :key="p.id"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
      >
        <ProductCard :product="p" />
      </el-col>
    </el-row>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, total"
        background
        @current-change="loadData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductList, getCategories } from '@/api/goods'
import type { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const page = ref(1)
const pageSize = 8
const total = ref(0)
const loading = ref(false)
const categoryId = ref(0)

onMounted(async () => {
  categories.value = await getCategories()
  // 读取 URL 参数（搜索关键字 / 分类）
  categoryId.value = Number(route.query.categoryId || 0)
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const data = await getProductList({
      page: page.value,
      pageSize,
      keyword: (route.query.keyword as string) || '',
      categoryId: categoryId.value || undefined
    })
    products.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadData()
}
</script>

<style scoped>
.goods-list {
  padding: 24px 16px 40px;
}
.filters {
  margin-bottom: 20px;
}
.goods-list :deep(.el-col) {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
