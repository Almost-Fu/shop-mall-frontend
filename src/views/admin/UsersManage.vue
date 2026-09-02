<template>
  <el-card shadow="never">
    <template #header>用户管理</template>

    <el-table :data="users" v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="账号" width="140" />
      <el-table-column prop="nickname" label="昵称" width="160" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" size="small">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api/user'
import type { AdminUser } from '@/types'

const users = ref<AdminUser[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    users.value = await getUsers()
  } finally {
    loading.value = false
  }
})
</script>
