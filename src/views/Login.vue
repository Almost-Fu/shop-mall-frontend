<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">🛒 ShopMall 登录</h2>
      <p class="subtitle">商城前台 + 后台管理系统演示</p>

      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入账号" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>

      <!-- 预置账号提示 -->
      <el-alert type="info" :closable="false" class="tips">
        <p>管理员账号：<b>admin</b> / 123456（登录进入后台）</p>
        <p>普通用户：<b>user</b> / 123456（登录进入商城首页）</p>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})
const loading = ref(false)

/**
 * 登录逻辑：
 * 账号密码校验在 mock 接口层完成，这里只根据返回的角色做跳转分流，
 * 不在页面里写死任何账号判断，适配后续对接真实后端。
 */
async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }
  loading.value = true
  try {
    const user = await userStore.login({ ...form })
    ElMessage.success(`欢迎回来，${user.nickname}`)

    // 角色分流：admin 进后台，user 进商城首页
    if (user.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      const redirect = route.query.redirect as string
      router.push(redirect || '/home')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 44px 34px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}
.title {
  text-align: center;
  margin-bottom: 4px;
  font-size: 26px;
}
.subtitle {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 30px;
}
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
}
.tips {
  margin-top: 22px;
}
.tips p {
  margin: 2px 0;
  font-size: 13px;
}
</style>
