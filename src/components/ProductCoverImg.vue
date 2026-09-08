<template>
  <img
    v-if="src"
    :src="src"
    :alt="altText"
    class="product-cover-img"
    loading="lazy"
    @error="handleError"
  />
  <div v-else class="product-cover-fallback" :class="`is-${size}`">
    {{ fallbackText }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  productLocalImage,
  resolveProductImage,
  type CoverSource
} from '@/utils/productImage'

/**
 * 统一商品封面 <img>：
 * - 商品 image URL 优先，加载失败自动降级到 public/images 本地图库
 * - 本地图也失败 / 无匹配图时，显示「商品名首字」文字占位（不渲染 emoji）
 * 尺寸由父容器控制，本组件铺满；占位字号按 size 区分。
 */
const props = withDefaults(
  defineProps<{
    product: CoverSource
    alt?: string
    /** 占位字号档位：卡片 sm / 列表与卡片 md / 详情大图 lg */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    alt: '',
    size: 'md'
  }
)

const src = ref<string | null>(resolveProductImage(props.product))

const altText = computed(() => props.alt || props.product.name || '商品图片')

/** 无图时展示商品名首字符 */
const fallbackText = computed(() => {
  const name = (props.product.name || '').trim()
  return name ? Array.from(name)[0] : '？'
})

/** 商品数据整体刷新（如重新拉列表）后重算封面 */
watch(
  () => props.product,
  () => {
    src.value = resolveProductImage(props.product)
  }
)

/** 图片加载失败：远程图 → 本地图库 → 文字占位 */
function handleError() {
  const local = productLocalImage(props.product)
  if (src.value !== local) {
    src.value = local
  } else {
    src.value = null
  }
}
</script>

<style scoped>
.product-cover-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.product-cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef1f6 0%, #e2e8f0 100%);
  color: #8492a6;
  font-weight: 700;
  user-select: none;
}

.product-cover-fallback.is-sm {
  font-size: 18px;
}

.product-cover-fallback.is-md {
  font-size: 42px;
}

.product-cover-fallback.is-lg {
  font-size: 72px;
}
</style>
