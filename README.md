# 🛒 ShopMall 商城（前后端分离项目）

一个用于求职作品集的 **Vue3 + TypeScript + Vite** 前端项目，包含**商城前台**与**后台管理系统**，采用前后端分离架构，对接 FastAPI + MySQL 后端（见配套 `shop-backend` 项目）。

## ✨ 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| UI 库 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router 4（含角色路由守卫） |
| 请求 | Axios（统一封装 + 拦截器） |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build
```

> 前端请求后端接口，需先启动配套后端 `shop-backend`（FastAPI + MySQL）。
> 后端接口地址由环境变量 `VITE_API_BASE_URL` 配置。

## 👤 预置账号（后端）

| 角色 | 账号 | 密码 | 登录后跳转 |
|------|------|------|-----------|
| 管理员 | `admin` | `123456` | 后台管理系统 |
| 普通用户 | `user` | `123456` | 商城首页 |

> 账号密码校验逻辑位于后端，前端页面组件不含任何账号判断。

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
┌─────────────┐      ┌──────────────────┐      ┌───────────────┐
│   Vue 组件   │ ───> │  src/api 请求层   │ ───> │  FastAPI 后端 │
│  (业务页面)  │      │  (统一封装 axios) │      │  (SQLAlchemy) │
└─────────────┘      └──────────────────┘      └───────────────┘
```

- **baseURL** 由环境变量 `VITE_API_BASE_URL` 配置（开发环境指向 `http://localhost:8000`）
- 业务组件**禁止硬编码接口地址**，统一走 `src/api`
- 接口返回 `{ code, message, data }` 结构，axios 响应拦截器统一解包

## 📁 目录结构

```
shop-mall/
├── src/
│   ├── api/            # 接口层（auth / goods / order / user）
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

本项目为纯前端实现，通过 axios 统一请求层对接 FastAPI 后端接口，
后端返回 `{ code, message, data }` 结构，前端响应拦截器自动解包。

