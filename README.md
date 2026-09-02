# 🛒 ShopMall 商城（前后端分离演示项目）

一个用于求职作品集的 **Vue3 + TypeScript + Vite** 纯前端项目，包含**商城前台**与**后台管理系统**，采用前后端分离架构，通过 Mock 虚拟数据驱动全部业务，预留真实后端对接入口。

## ✨ 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| UI 库 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router 4（含角色路由守卫） |
| 请求 | Axios（统一封装 + Mock 适配器） |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认启用 Mock）
npm run dev

# 3. 构建生产版本
npm run build
```

## 👤 预置账号（Mock）

| 角色 | 账号 | 密码 | 登录后跳转 |
|------|------|------|-----------|
| 管理员 | `admin` | `123456` | 后台管理系统 |
| 普通用户 | `user` | `123456` | 商城首页 |

> 账号密码校验逻辑位于 `src/mock` 接口层，页面组件不含任何账号判断。

## 📦 功能清单

### 商城前台
- ✅ 首页商品展示、分类快捷入口、热销推荐
- ✅ 商品列表（分页 + 关键字搜索 + 分类筛选）
- ✅ 商品详情（加入购物车）
- ✅ 购物车（勾选、改数量、删除、结算下单）
- ✅ 登录页（角色分流跳转）

### 后台管理系统（仅 admin 可进）
- ✅ 数据看板（商品/订单/用户统计 + 销售额）
- ✅ 商品管理（分页 + 搜索）
- ✅ 订单管理
- ✅ 用户管理
- ✅ 路由守卫：普通 user 访问后台被拦截

## 🏗 前后端分离架构

```
┌─────────────┐      ┌──────────────────┐      ┌──────────┐
│   Vue 组件   │ ───> │  src/api 请求层   │ ───> │  后端接口 │
│  (业务页面)  │      │  (统一封装 axios) │      │ / Mock   │
└─────────────┘      └──────────────────┘      └──────────┘
```

- **baseURL** 由环境变量 `VITE_API_BASE_URL` 配置
- 业务组件**禁止硬编码接口地址**，统一走 `src/api`
- **Mock 切换**：`.env.development` 中 `VITE_USE_MOCK=true` 使用虚拟数据；
  对接真实后端时改为 `false`，仅需在 `src/api` 层调整，业务代码零改动

## 📁 目录结构

```
shop-mall/
├── src/
│   ├── api/            # 接口层（auth / goods / order / user）
│   ├── mock/           # Mock 虚拟数据 + 适配器
│   ├── types/          # 全局类型定义
│   ├── utils/          # axios 统一封装
│   ├── stores/         # Pinia（user / cart）
│   ├── router/         # 路由 + 角色守卫
│   ├── layouts/        # 前台 / 后台布局
│   ├── components/     # 公共组件（ProductCard）
│   ├── views/
│   │   ├── shop/       # 商城前台页面
│   │   └── admin/      # 后台管理页面
│   ├── App.vue
│   └── main.ts
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
└── vite.config.ts
```

## 📝 说明

本项目为纯前端实现，无任何后端/数据库代码，接口数据全部由 Mock 层模拟，
模拟真实前后端分离的交互方式（接口返回 `{ code, message, data }` 结构）。
