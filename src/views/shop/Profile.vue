<template>
  <div class="profile container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card" shadow="never">
      <div class="user-info">
        <div class="avatar">{{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}</div>
        <div class="info">
          <div class="nickname">
            {{ userStore.userInfo?.nickname || '未登录' }}
            <el-tag size="small" :type="userStore.role === 'admin' ? 'danger' : 'info'">
              {{ userStore.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </div>
          <div class="username">账号：{{ userStore.userInfo?.username }}</div>
        </div>
      </div>
    </el-card>

    <!-- 我的订单 -->
    <el-card class="orders-card" shadow="never">
      <template #header>📦 我的订单</template>

      <el-empty v-if="orders.length === 0" description="还没有订单，去逛逛吧" />

      <el-table v-else :data="orders" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
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
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getMyOrders } from '@/api/order'
import type { Order, OrderStatus } from '@/types'

const userStore = useUserStore()
const orders = ref<Order[]>([])
const loading = ref(false)

onMounted(loadOrders)

async function loadOrders() {
  const username = userStore.userInfo?.username
  if (!username) return
  loading.value = true
  try {
    orders.value = await getMyOrders(username)
  } finally {
    loading.value = false
  }
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
.profile {
  padding: 24px 16px 40px;
}
.user-card {
  margin-bottom: 20px;
  border-radius: 14px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nickname {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.username {
  color: #999;
  font-size: 14px;
}
.orders-card {
  border-radius: 14px;
}
.order-item {
  line-height: 1.8;
}
</style>
