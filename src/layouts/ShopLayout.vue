<template>
  <div class="shop-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner container">
        <router-link to="/home" class="logo">🛒 ShopMall</router-link>

        <nav class="nav">
          <router-link to="/home">首页</router-link>
          <router-link to="/goods">全部商品</router-link>
        </nav>

        <div class="actions">
          <el-input
            v-model="keyword"
            class="search"
            placeholder="搜索商品"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>

          <router-link to="/cart" class="cart">
            <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0">
              <el-icon :size="22"><ShoppingCart /></el-icon>
            </el-badge>
          </router-link>

          <!-- 用户信息 / 登录 -->
          <el-dropdown v-if="userStore.isLoggedIn" @command="handleCommand">
            <span class="user">
              <el-icon :size="20"><User /></el-icon>
              {{ userStore.userInfo?.nickname }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="userStore.role === 'admin'" command="admin">
                  进入后台
                </el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <router-link v-else to="/login" class="login-btn">登录</router-link>
        </div>
      </div>
    </header>

    <!-- 页面内容 -->
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const keyword = ref('')

/** 搜索：跳转到商品列表并携带关键字 */
function handleSearch() {
  router.push({ path: '/goods', query: { keyword: keyword.value } })
}

/** 下拉菜单命令 */
function handleCommand(command: string) {
  if (command === 'admin') {
    router.push('/admin')
  } else if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/home')
  }
}
</script>

<style scoped>
.shop-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
}
.logo {
  font-size: 22px;
  font-weight: 800;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}
.nav {
  display: flex;
  gap: 24px;
}
.nav a {
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
  padding: 4px 0;
}
.nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 3px;
  background: var(--brand-gradient);
  border-radius: 2px;
  transition: width 0.25s;
}
.nav a.router-link-active {
  color: var(--brand);
  font-weight: 600;
}
.nav a.router-link-active::after,
.nav a:hover::after {
  width: 100%;
}
.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
}
.search {
  width: 220px;
}
.cart {
  color: #333;
  display: flex;
  align-items: center;
}
.user {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #333;
}
.login-btn {
  color: #409eff;
  font-weight: bold;
}
.main {
  flex: 1;
}

/* ===== 移动端响应式 ===== */
@media (max-width: 768px) {
  .header-inner {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 16px;
    gap: 12px;
  }
  .nav {
    order: 3;
    width: 100%;
    gap: 16px;
  }
  .search {
    flex: 1;
    width: auto;
    min-width: 120px;
  }
}
</style>
