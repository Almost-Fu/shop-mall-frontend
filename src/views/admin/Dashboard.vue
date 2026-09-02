<template>
  <div>
    <el-row :gutter="16">
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="商品总数" :value="products.length" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="订单总数" :value="orders.length" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="用户总数" :value="users.length" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover">
          <el-statistic title="累计销售额(¥)" :value="totalSales" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近订单 -->
    <el-card shadow="never" class="recent">
      <template #header>最近订单</template>
      <el-table :data="orders.slice(0, 5)" size="small">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="totalPrice" label="金额" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProductList } from '@/api/goods'
import { getOrders } from '@/api/order'
import { getUsers } from '@/api/user'
import type { Product, Order, AdminUser, OrderStatus } from '@/types'

const products = ref<Product[]>([])
const orders = ref<Order[]>([])
const users = ref<AdminUser[]>([])

const totalSales = computed(() =>
  orders.value.reduce((sum, o) => sum + o.totalPrice, 0)
)

onMounted(async () => {
  const [p, o, u] = await Promise.all([
    getProductList({ page: 1, pageSize: 100 }),
    getOrders(),
    getUsers()
  ])
  products.value = p.list
  orders.value = o
  users.value = u
})

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
.recent {
  margin-top: 16px;
}
</style>
