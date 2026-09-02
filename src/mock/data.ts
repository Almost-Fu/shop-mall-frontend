import type { Category, Product, Order, AdminUser, UserInfo } from '@/types'

/**
 * Mock 虚拟数据
 * 说明：此文件模拟后端数据库，对接真实后端后整个文件可删除，
 * 通过环境变量 VITE_USE_MOCK=false 即可切换到真实接口。
 */

/** 商品分类 */
export const mockCategories: Category[] = [
  { id: 1, name: '手机数码' },
  { id: 2, name: '电脑办公' },
  { id: 3, name: '智能穿戴' }
]

/** 商品列表（cover 用 emoji 占位，避免依赖外部图片） */
export const mockProducts: Product[] = [
  { id: 1, name: '星曜 X5 智能手机', price: 3999, originalPrice: 4599, cover: '📱', categoryId: 1, categoryName: '手机数码', stock: 120, sales: 3200, description: '6.7 英寸高刷屏，5000mAh 大电池，旗舰影像系统。' },
  { id: 2, name: '轻薄本 Pro 14', price: 5499, originalPrice: 6299, cover: '💻', categoryId: 2, categoryName: '电脑办公', stock: 60, sales: 1580, description: '2.8K 高清屏，金属机身，长续航办公首选。' },
  { id: 3, name: '降噪蓝牙耳机', price: 499, originalPrice: 699, cover: '🎧', categoryId: 1, categoryName: '手机数码', stock: 300, sales: 8600, description: '主动降噪，30 小时超长续航。' },
  { id: 4, name: '智能手表 GT3', price: 1299, originalPrice: 1499, cover: '⌚', categoryId: 3, categoryName: '智能穿戴', stock: 200, sales: 2100, description: '血氧监测，GPS 定位，14 天续航。' },
  { id: 5, name: '平板 Pad Air', price: 2899, originalPrice: 3299, cover: '📟', categoryId: 2, categoryName: '电脑办公', stock: 80, sales: 960, description: '11 英寸全面屏，支持手写笔。' },
  { id: 6, name: '机械键盘 87 键', price: 399, originalPrice: 499, cover: '⌨️', categoryId: 2, categoryName: '电脑办公', stock: 150, sales: 4300, description: '热插拔轴体，RGB 背光。' },
  { id: 7, name: '无线鼠标 Pro', price: 199, originalPrice: 259, cover: '🖱️', categoryId: 2, categoryName: '电脑办公', stock: 400, sales: 12000, description: '静音微动，DPI 可调。' },
  { id: 8, name: '4K 显示器 27 寸', price: 2199, originalPrice: 2599, cover: '🖥️', categoryId: 2, categoryName: '电脑办公', stock: 40, sales: 720, description: 'IPS 面板，广色域，Type-C 一线连。' },
  { id: 9, name: '便携蓝牙音箱', price: 299, originalPrice: 399, cover: '🔊', categoryId: 1, categoryName: '手机数码', stock: 180, sales: 5600, description: 'IPX7 防水，户外随身。' },
  { id: 10, name: '智能路由器 AX6', price: 349, originalPrice: 429, cover: '📡', categoryId: 1, categoryName: '手机数码', stock: 90, sales: 3100, description: 'WiFi6，信号强劲穿墙。' },
  { id: 11, name: '运动相机 4K', price: 1599, originalPrice: 1899, cover: '📷', categoryId: 3, categoryName: '智能穿戴', stock: 70, sales: 640, description: '防抖拍摄，裸机防水。' },
  { id: 12, name: '快充充电宝 20000mAh', price: 159, originalPrice: 199, cover: '🔋', categoryId: 1, categoryName: '手机数码', stock: 500, sales: 15000, description: '22.5W 双向快充，可上飞机。' }
]

/** 后台用户列表 */
export const mockUsers: AdminUser[] = [
  { id: 1, username: 'admin', nickname: '系统管理员', role: 'admin', createTime: '2026-01-10 09:00:00' },
  { id: 2, username: 'user', nickname: '普通用户', role: 'user', createTime: '2026-02-15 14:30:00' },
  { id: 3, username: 'zhangsan', nickname: '张三', role: 'user', createTime: '2026-03-20 11:20:00' },
  { id: 4, username: 'lisi', nickname: '李四', role: 'user', createTime: '2026-05-06 16:45:00' }
]

/** 订单列表 */
export const mockOrders: Order[] = [
  {
    id: 1,
    orderNo: 'NO202608010001',
    username: 'user',
    items: [{ name: '降噪蓝牙耳机', price: 499, count: 1 }],
    totalPrice: 499,
    status: '已发货',
    createTime: '2026-08-01 10:20:00'
  },
  {
    id: 2,
    orderNo: 'NO202608120002',
    username: 'zhangsan',
    items: [
      { name: '星曜 X5 智能手机', price: 3999, count: 1 },
      { name: '快充充电宝 20000mAh', price: 159, count: 2 }
    ],
    totalPrice: 4317,
    status: '待发货',
    createTime: '2026-08-12 15:30:00'
  },
  {
    id: 3,
    orderNo: 'NO202608200003',
    username: 'lisi',
    items: [{ name: '智能手表 GT3', price: 1299, count: 1 }],
    totalPrice: 1299,
    status: '已完成',
    createTime: '2026-08-20 09:10:00'
  },
  {
    id: 4,
    orderNo: 'NO202608280004',
    username: 'user',
    items: [{ name: '4K 显示器 27 寸', price: 2199, count: 1 }],
    totalPrice: 2199,
    status: '待付款',
    createTime: '2026-08-28 20:40:00'
  }
]

/** 预置账号（账号密码校验逻辑放在 mock 接口层） */
export const mockAccounts: (UserInfo & { password: string; token: string })[] = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    nickname: '系统管理员',
    role: 'admin',
    token: 'mock-token-admin'
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    nickname: '普通用户',
    role: 'user',
    token: 'mock-token-user'
  }
]
