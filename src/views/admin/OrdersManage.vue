<template>
  <el-card shadow="never">
    <template #header>订单管理</template>

    <el-table :data="orders" v-loading="loading">
      <el-table-column prop="orderNo" label="订单号" width="180" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column label="商品" min-width="200">
        <template #default="{ row }">
          <div v-for="(item, i) in row.items" :key="i" class="order-item">
            {{ item.name }} × {{ item.count }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="金额" width="110">
        <template #default="{ row }">¥{{ row.totalPrice }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="180" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === '待发货'" link type="primary" @click="changeStatus(row, '已发货')">
            发货
          </el-button>
          <el-button v-if="row.status === '已发货'" link type="success" @click="changeStatus(row, '已完成')">
            完成
          </el-button>
          <el-button v-if="row.status === '待付款'" link type="danger" @click="changeStatus(row, '已取消')">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrders, updateOrderStatus } from '@/api/order'
import type { Order, OrderStatus } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(false)

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    orders.value = await getOrders()
  } finally {
    loading.value = false
  }
}

async function changeStatus(row: Order, status: OrderStatus) {
  await updateOrderStatus(row.id, status)
  ElMessage.success(`订单已${status}`)
  loadData()
}

function statusType(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    待付款: 'warning',
    待发货: 'primary',
    已发货: 'info',
    已完成: 'success',
    已取消: 'danger'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.order-item {
  line-height: 1.8;
}
</style>
