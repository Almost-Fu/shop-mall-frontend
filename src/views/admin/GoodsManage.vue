<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span>商品管理</span>
        <div class="header-right">
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
          <el-button type="primary" @click="openAdd">
            <el-icon><Plus /></el-icon> 新增商品
          </el-button>
        </div>
      </div>
    </template>

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="goods-cell">
            <div class="goods-thumb">
              <ProductCoverImg :product="row" size="sm" />
            </div>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" width="110" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column prop="sales" label="销量" width="80" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新增商品'" width="680px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="form.categoryId" placeholder="选择分类" @change="handleCategoryChange">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="售价" required>
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="form.originalPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="封面">
          <div class="cover-editor">
            <div class="cover-preview">
              <img
                v-if="previewUrl && !previewError"
                :src="previewUrl"
                alt="封面预览"
                @error="previewError = true"
              />
              <span v-else>{{ nameFirstChar }}</span>
            </div>
            <div class="cover-main">
              <el-input
                v-model="form.image"
                placeholder="粘贴图片地址（https://… 或 /images/…）"
                clearable
              />
              <div class="cover-tip">
                只能设置 1 张图片作封面；不填图片时，封面自动显示商品名首字「{{ nameFirstChar }}」
              </div>
              <div class="cover-library">
                <span class="library-hint">或从内置图库选一张：</span>
                <div class="library-grid">
                  <div
                    v-for="img in libraryImages"
                    :key="img.file"
                    class="library-item"
                    :class="{ active: form.image === img.local }"
                    :title="img.label"
                    @click="pickCoverImage(img)"
                  >
                    <img
                      v-if="!img.failed"
                      :src="img.src"
                      :alt="img.label"
                      loading="lazy"
                      @error="img.failed = true"
                    />
                    <span v-else>{{ img.label.slice(0, 1) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="销量">
          <el-input-number v-model="form.sales" :min="0" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getProductList,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/api/goods'
import type { Product, Category, ProductForm } from '@/types'
import { coverImageUrl } from '@/utils/productImage'
import ProductCoverImg from '@/components/ProductCoverImg.vue'

const list = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const submitting = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = 10
const total = ref(0)

const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(0)

const emptyForm: ProductForm = {
  name: '',
  price: 0,
  originalPrice: undefined,
  cover: '',
  categoryId: 0,
  categoryName: '',
  stock: 0,
  sales: 0,
  description: '',
  image: ''
}
const form = reactive<ProductForm>({ ...emptyForm })

/** ===== 封面图片：只能设置 1 张（内置图库单选 / 粘贴 URL）===== */
const IMAGE_LIBRARY = [
  { file: '智能手机.jpg', label: '智能手机' },
  { file: '蓝牙耳机.jpg', label: '蓝牙耳机' },
  { file: '轻薄本.jpg', label: '轻薄本' },
  { file: '键盘.jpg', label: '机械键盘' },
  { file: '智能手表.jpg', label: '智能手表' },
  { file: '扫地机器人.jpg', label: '扫地机器人' },
  { file: '巧克力礼盒.jpg', label: '巧克力礼盒' },
  { file: '咖啡豆.jpg', label: '咖啡豆' },
  { file: '前端开发书籍.jpg', label: '前端开发书籍' }
]

interface LibraryImage {
  file: string
  label: string
  /** 存入商品 image 字段的值：/images/xxx.jpg */
  local: string
  /** 预览用 src：已拼 BASE_URL */
  src: string
  failed: boolean
}

/** 生成图库条目：src 用于渲染缩略图，local 是提交给后端的封面地址 */
function buildLibrary(): LibraryImage[] {
  const base = import.meta.env.BASE_URL
  return IMAGE_LIBRARY.map(({ file, label }) => ({
    file,
    label,
    local: `/images/${file}`,
    src: `${base}images/${file}`,
    failed: false
  }))
}

const libraryImages = ref<LibraryImage[]>(buildLibrary())

/** 封面预览 src：远程地址原样，本地相对路径拼 BASE_URL，空则 null */
const previewUrl = computed(() => coverImageUrl(form.image))
const previewError = ref(false)

/** 无图时的封面占位：商品名首字 */
const nameFirstChar = computed(() => {
  const t = form.name.trim()
  return t ? Array.from(t)[0] : '商'
})

/** 点击内置图库：选中这一张（单选，替换原封面） */
function pickCoverImage(img: LibraryImage) {
  form.image = img.local
  previewError.value = false
}

/** 每次开弹窗时重置图库缩略图的加载失败状态 */
function resetLibrary() {
  libraryImages.value.forEach((img) => {
    img.failed = false
  })
}

watch(
  () => form.image,
  () => {
    previewError.value = false
  }
)

onMounted(async () => {
  categories.value = await getCategories()
  loadData()
})

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

function openAdd() {
  isEdit.value = false
  editId.value = 0
  Object.assign(form, emptyForm)
  resetLibrary()
  dialogVisible.value = true
}

function openEdit(row: Product) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    name: row.name,
    price: row.price,
    originalPrice: row.originalPrice,
    cover: '',
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    stock: row.stock,
    sales: row.sales,
    description: row.description,
    image: row.image || ''
  })
  resetLibrary()
  dialogVisible.value = true
}

function handleCategoryChange(categoryId: number) {
  const cat = categories.value.find((c) => c.id === categoryId)
  form.categoryName = cat?.name || ''
}

async function submit() {
  if (!form.name || !form.categoryId) {
    ElMessage.warning('请填写商品名称并选择分类')
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateProduct(editId.value, { ...form, cover: nameFirstChar.value })
      ElMessage.success('修改成功')
    } else {
      await createProduct({ ...form, cover: nameFirstChar.value })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: Product) {
  await ElMessageBox.confirm(`确定删除商品「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteProduct(row.id)
  ElMessage.success('删除成功')
  loadData()
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-right {
  display: flex;
  gap: 12px;
}
.search {
  width: 240px;
}
.goods-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.goods-thumb {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f2f6;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
/* ===== 封面（单图）编辑器 ===== */
.cover-editor {
  display: flex;
  gap: 14px;
  width: 100%;
}
.cover-preview {
  width: 92px;
  height: 92px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px dashed #d0d7de;
  background: linear-gradient(135deg, #eef1f6 0%, #e2e8f0 100%);
  color: #8492a6;
  font-size: 34px;
  font-weight: 700;
}
.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-main {
  flex: 1;
  min-width: 0;
}
.cover-tip {
  font-size: 12px;
  color: #98a2b3;
  line-height: 1.6;
  margin-top: 6px;
}
.cover-library {
  margin-top: 12px;
}
.library-hint {
  font-size: 12px;
  color: #666;
}
.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 8px;
  margin-top: 6px;
}
.library-item {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  background: #f1f2f6;
  font-size: 20px;
  color: #8492a6;
  font-weight: 700;
  transition: border-color 0.2s ease;
}
.library-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.library-item:hover {
  border-color: #a0cfff;
}
.library-item.active {
  border-color: #409eff;
}
</style>
