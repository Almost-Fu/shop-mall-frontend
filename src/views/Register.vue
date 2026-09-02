<template>
  <div class="register-page">
    <div class="register-card">
      <h2 class="title">📝 创建账号</h2>
      <p class="subtitle">注册后即可在商城购物</p>

      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.username" placeholder="账号（至少3位）" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.nickname" placeholder="昵称（可选）" size="large">
            <template #prefix><el-icon><Postcard /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码（至少6位）"
            size="large"
            show-password
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
            show-password
            @keyup.enter="handleRegister"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="register-btn"
          :loading="loading"
          @click="handleRegister"
        >
          注 册
        </el-button>
      </el-form>

      <p class="login-link">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const form = reactive({
  username: '',
  nickname: '',
  password: ''
})
const confirmPassword = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }
  if (form.username.length < 3) {
    ElMessage.warning('账号至少 3 位')
    return
  }
  if (form.password.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return
  }
  if (form.password !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await register({ ...form })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.register-card {
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
.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
}
.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}
.login-link a {
  color: #6366f1;
  font-weight: bold;
}
</style>
