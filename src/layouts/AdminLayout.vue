<template>
  <el-container class="admin-layout">
    <!-- 侧边菜单 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="brand">🛒 ShopMall 后台</div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        background-color="#001529"
        text-color="#a6adb4"
        active-text-color="#fff"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>数据看板</span>
        </el-menu-item>
        <el-menu-item index="/admin/goods">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="header">
        <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <div class="header-right">
          <span class="welcome">你好，{{ userStore.userInfo?.nickname }}</span>
          <el-button link type="primary" @click="goShop">回商城</el-button>
          <el-button link type="danger" @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <!-- 内容 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

function goShop() {
  router.push('/home')
}

function logout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
.aside {
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
  transition: width 0.3s;
  overflow: hidden;
}
.brand {
  color: #fff;
  font-weight: bold;
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  white-space: nowrap;
}
.aside :deep(.el-menu) {
  border-right: none;
  background: transparent;
}
.aside :deep(.el-menu-item) {
  border-radius: 8px;
  margin: 4px 8px;
}
.aside :deep(.el-menu-item.is-active) {
  background: var(--brand-gradient) !important;
}
.header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.welcome {
  color: #666;
}
.main {
  background: #f5f7fa;
}
</style>
