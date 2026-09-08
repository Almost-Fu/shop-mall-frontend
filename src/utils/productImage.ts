/**
 * 商品封面图片解析工具
 * =====================
 * 统一"商品封面"图源策略，彻底弃用 emoji 大字当封面：
 *   1. 商品自带 image（http(s)/data URL，或 /images/xxx.jpg 相对路径）→ 优先使用
 *   2. 无 image / 加载失败 → 按 cover（兼容旧 emoji 数据）或商品名匹配 public/images 本地图
 *   3. 仍无匹配 → 返回 null，由组件展示商品名首字占位（不显示 emoji）
 *
 * 本地图库来源：D:\images 的商品实拍图，部署时需连同 public/ 一起发布。
 * 若有新增商品类型，在 public/images 放同名图片并补一条规则即可。
 */

/** 只需这几项即可解析封面（商品 / 购物车条目均可） */
export interface CoverSource {
  name?: string
  cover?: string
  image?: string | null
}

/** cover emoji → public/images 下的图片文件名（兼容历史数据；新数据 cover 存商品名首字） */
const COVER_IMAGE_MAP: Record<string, string> = {
  '📱': '智能手机.jpg',
  '🎧': '蓝牙耳机.jpg',
  '💻': '轻薄本.jpg',
  '⌨️': '键盘.jpg',
  '⌚': '智能手表.jpg',
  '🧹': '扫地机器人.jpg',
  '🍫': '巧克力礼盒.jpg',
  '☕': '咖啡豆.jpg',
  '📚': '前端开发书籍.jpg'
}

/** 商品名关键词 → 本地图片文件名（按顺序匹配，先命中先生效） */
const NAME_IMAGE_RULES: { match: string; file: string }[] = [
  { match: '手机', file: '智能手机.jpg' },
  { match: '耳机', file: '蓝牙耳机.jpg' },
  { match: '轻薄本', file: '轻薄本.jpg' },
  { match: '笔记本', file: '轻薄本.jpg' },
  { match: '键盘', file: '键盘.jpg' },
  { match: '手表', file: '智能手表.jpg' },
  { match: '扫地', file: '扫地机器人.jpg' },
  { match: '巧克力', file: '巧克力礼盒.jpg' },
  { match: '咖啡', file: '咖啡豆.jpg' },
  { match: '前端', file: '前端开发书籍.jpg' }
]

/** public 下图片目录，自动适配 Vite base 路径 */
const IMG_DIR = `${import.meta.env.BASE_URL}images/`

/** 是否为可直接使用的远程/数据图片地址 */
function isRemoteImage(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || url.startsWith('data:')
}

/**
 * 计算单张图片可用的 src：
 * - http(s)://、data: 原样返回
 * - /images/xxx.jpg 或 images/xxx.jpg 等相对路径 → 拼上 BASE_URL（适配子目录部署）
 * - 空 → null
 */
export function coverImageUrl(image?: string | null): string | null {
  const v = image?.trim()
  if (!v) return null
  if (isRemoteImage(v)) return v
  const base = import.meta.env.BASE_URL
  if (v.startsWith(base)) return v
  return base + v.replace(/^\/+/, '')
}

/**
 * 从本地图库匹配图片地址。
 * 命中顺序：cover（兼容旧 emoji）精确匹配 → 商品名关键词匹配；未命中返回 null。
 */
export function productLocalImage(product: CoverSource): string | null {
  const coverKey = product.cover?.trim() || ''
  if (coverKey && COVER_IMAGE_MAP[coverKey]) {
    return IMG_DIR + COVER_IMAGE_MAP[coverKey]
  }

  const name = product.name || ''
  for (const rule of NAME_IMAGE_RULES) {
    if (name.includes(rule.match)) return IMG_DIR + rule.file
  }
  return null
}

/**
 * 解析商品最终封面地址：
 * 商品 image URL（远程或本地路径）优先，其次本地图库，最后 null（组件展示首字占位）。
 */
export function resolveProductImage(product: CoverSource): string | null {
  const image = coverImageUrl(product.image)
  if (image) return image
  return productLocalImage(product)
}

