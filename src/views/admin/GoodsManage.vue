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
              <div class="cover-upload-row">
                <el-upload
                  :show-file-list="false"
                  accept="image/*"
                  :before-upload="beforeUpload"
                  :http-request="uploadCover"
                >
                  <el-button type="primary" plain :loading="uploading">
                    <el-icon style="margin-right: 4px"><Upload /></el-icon>上传封面图片
                  </el-button>
                </el-upload>
                <el-input
                  v-model="form.image"
                  placeholder="或粘贴图片地址（https://…）"
                  clearable
                  class="cover-url"
                />
              </div>
              <div class="cover-tip">
                自定义上传 1 张图片作封面（可重新上传替换）；不填图片时封面显示商品名首字「{{ nameFirstChar }}」
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
import { request } from '@/utils/request'
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

/** ===== 封面图片：自定义上传 / 粘贴地址（只能 1 张）===== */
const uploading = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

/** 上传前校验：仅图片且 ≤ 5MB */
function beforeUpload(file: File): boolean {
  const isImage = /^image\/(jpeg|png|gif|webp)$/i.test(file.type)
  if (!isImage) {
    ElMessage.warning('仅支持 jpg / png / gif / webp 图片')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return false
  }
  return true
}

/** 自定义上传：发到后端 /upload/image，成功后把返回的图片地址设为封面 */
async function uploadCover(option: { file: File }) {
  const fd = new FormData()
  fd.append('file', option.file)
  uploading.value = true
  try {
    const res = await request<{ url: string }>({
      url: '/upload/image',
      method: 'post',
      data: fd
    })
    // 后端返回相对路径 /static/...，存库时拼上后端地址，前台/后台都能直接访问
    form.image = API_BASE + res.url
    previewError.value = false
    ElMessage.success('封面上传成功')
  } catch {
    ElMessage.error('封面上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

/** 封面预览 src：远程地址原样，本地相对路径拼 BASE_URL，空则 null */
const previewUrl = computed(() => coverImageUrl(form.image))
const previewError = ref(false)

/** 无图时的封面占位：商品名首字 */
const nameFirstChar = computed(() => {
  const t = form.name.trim()
  return t ? Array.from(t)[0] : '商'
})

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
.cover-upload-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.cover-url {
  flex: 1;
  min-width: 0;
}
</style>
