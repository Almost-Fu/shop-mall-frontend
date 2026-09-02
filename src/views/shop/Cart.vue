<template>
  <div class="cart container">
    <h3 class="title">🛒 购物车</h3>

    <el-empty v-if="cartStore.items.length === 0" description="购物车还是空的" />

    <template v-else>
      <el-table :data="cartStore.items" class="table">
        <el-table-column width="60">
          <template #default="{ row }">
            <el-checkbox
              :model-value="row.checked"
              @change="cartStore.toggleChecked(row.productId)"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品">
          <template #default="{ row }">
            <div class="goods-cell">
              <span class="cover">{{ row.cover }}</span>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="180">
          <template #default="{ row }">
            <el-input-number
              :model-value="row.count"
              :min="1"
              :max="row.stock"
              size="small"
              @change="(v: number | undefined) => cartStore.updateCount(row.productId, v ?? 1)"
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="{ row }">¥{{ row.price * row.count }}</template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="{ row }">
            <el-button link type="danger" @click="cartStore.removeFromCart(row.productId)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 结算栏 -->
      <div class="footer">
        <el-checkbox
          :model-value="allChecked"
          :indeterminate="isIndeterminate"
          @change="(v: unknown) => cartStore.toggleAll(v as boolean)"
        >
          全选
        </el-checkbox>
        <div class="total">
          合计：<span class="price">¥{{ cartStore.checkedPrice }}</span>
          （{{ cartStore.checkedItems.length }} 件）
        </div>
        <el-button type="primary" size="large" @click="checkout">去结算</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { createOrder } from '@/api/order'

const cartStore = useCartStore()
const userStore = useUserStore()

const allChecked = computed(
  () => cartStore.items.length > 0 && cartStore.items.every((i) => i.checked)
)
const isIndeterminate = computed(
  () =>
    cartStore.items.some((i) => i.checked) && !cartStore.items.every((i) => i.checked)
)

/** 结算：调创建订单接口，成功后清空已勾选 */
async function checkout() {
  if (cartStore.checkedItems.length === 0) {
    ElMessage.warning('请先勾选要结算的商品')
    return
  }
  await createOrder({
    // 使用当前登录用户的账号，而非写死
    username: userStore.userInfo?.username || 'guest',
    items: cartStore.checkedItems.map((i) => ({
      name: i.name,
      price: i.price,
      count: i.count
    })),
    totalPrice: cartStore.checkedPrice
  })
  ElMessage.success('下单成功！')
  cartStore.clearChecked()
}
</script>

<style scoped>
.cart {
  padding: 24px 16px 40px;
}
.title {
  margin-bottom: 16px;
}
.table {
  width: 100%;
}
.goods-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cover {
  font-size: 26px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f2f6;
  border-radius: 10px;
}
.footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  position: sticky;
  bottom: 16px;
}
.total {
  color: #666;
}
.price {
  color: #ff4d4f;
  font-size: 24px;
  font-weight: bold;
}
</style>
