<template>
  <div class="product-card" @click="goDetail">
    <div class="cover" :class="coverClass">
      <ProductCoverImg :product="product" />
      <span v-if="product.originalPrice" class="badge">特惠</span>
    </div>
    <div class="info">
      <div class="name">{{ product.name }}</div>
      <div class="price-row">
        <span class="price"><i>¥</i>{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original">¥{{ product.originalPrice }}</span>
      </div>
      <div class="sales">已售 {{ product.sales }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import ProductCoverImg from '@/components/ProductCoverImg.vue'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()

/** 根据商品 id 分配渐变色封面 */
const coverClass = computed(() => `cover-grad-${props.product.id % 6}`)

function goDetail() {
  router.push(`/goods/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--card-shadow-hover);
}
.cover {
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.product-card:hover .cover > :deep(.product-cover-img) {
  transform: scale(1.06);
}
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
}
.info {
  padding: 14px 16px 18px;
}
.name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
}
.price i {
  font-style: normal;
  font-size: 13px;
}
.original {
  color: #b0b7c3;
  font-size: 13px;
  text-decoration: line-through;
}
.sales {
  color: #98a2b3;
  font-size: 12px;
  margin-top: 4px;
}
</style>
