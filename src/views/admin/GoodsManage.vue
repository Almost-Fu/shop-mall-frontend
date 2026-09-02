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
            <span class="cover">{{ row.cover }}</span>
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
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新增商品'" width="520px">
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
          <el-input v-model="form.cover" placeholder="输入 emoji，如 📦" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getProductList,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/api/goods'
import type { Product, Category, ProductForm } from '@/types'

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
  cover: '📦',
  categoryId: 0,
  categoryName: '',
  stock: 0,
  sales: 0,
  description: ''
}
const form = reactive<ProductForm>({ ...emptyForm })

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
    cover: row.cover,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    stock: row.stock,
    sales: row.sales,
    description: row.description
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
      await updateProduct(editId.value, { ...form })
      ElMessage.success('修改成功')
    } else {
      await createProduct({ ...form })
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
.cover {
  font-size: 24px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
