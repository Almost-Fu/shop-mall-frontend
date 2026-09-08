<template>
  <div class="detail container">
    <el-card v-if="product" class="card" shadow="never">
      <div class="detail-body">
        <div class="cover" :class="coverClass">
          <ProductCoverImg :product="product" size="lg" />
        </div>
        <div class="info">
          <h2 class="name">{{ product.name }}</h2>
          <div class="price-row">
            <span class="price">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="original">
              原价 ¥{{ product.originalPrice }}
            </span>
          </div>
          <div class="meta">
            <span>分类：{{ product.categoryName }}</span>
            <span>库存：{{ product.stock }}</span>
            <span>销量：{{ product.sales }}</span>
          </div>
          <p class="desc">{{ product.description }}</p>

          <div class="actions">
            <el-input-number v-model="count" :min="1" :max="product.stock" />
            <el-button type="primary" size="large" @click="addCart">
              加入购物车
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-skeleton v-else :rows="6" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductDetail } from '@/api/goods'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'
import ProductCoverImg from '@/components/ProductCoverImg.vue'

const route = useRoute()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const count = ref(1)

const coverClass = computed(() => `cover-grad-${(product.value?.id ?? 0) % 6}`)

onMounted(async () => {
  const id = Number(route.params.id)
  product.value = await getProductDetail(id)
})

function addCart() {
  if (!product.value) return
  cartStore.addToCart(product.value, count.value)
  ElMessage.success('已加入购物车')
}
</script>

<style scoped>
.detail {
  padding: 24px 16px 40px;
}
.card {
  border-radius: 8px;
}
.detail-body {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}
.cover {
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}
.info {
  flex: 1;
  min-width: 260px;
}
.name {
  margin-bottom: 16px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.price {
  color: #f56c6c;
  font-size: 30px;
  font-weight: bold;
}
.original {
  color: #999;
  text-decoration: line-through;
}
.meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}
.desc {
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
}
.actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

@media (max-width: 768px) {
  .cover {
    width: 100%;
    height: 200px;
    font-size: 80px;
  }
}
</style>
