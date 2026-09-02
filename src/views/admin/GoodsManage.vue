<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span>商品管理</span>
        <el-input
          v-model="keyword"
          placeholder="搜索商品名称"
          clearable
          class="search"
          @keyup.enter="loadData"
        >
          <template #append>
            <el-button @click="loadData"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div>
    </template>

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="goods-cell">
            <span class="cover">{{ row.cover }}</span>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" width="120" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="90" />
      <el-table-column prop="sales" label="销量" width="90" />
    </el-table>

    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next, total"
      background
      class="pagination"
      @current-change="loadData"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProductList } from '@/api/goods'
import type { Product } from '@/types'

const list = ref<Product[]>([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    const data = await getProductList({
      page: page.value,
      pageSize,
      keyword: keyword.value || undefined
    })
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search {
  width: 240px;
}
.goods-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cover {
  font-size: 24px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
