# tech.md · 自定义封面设计工具 — 技术架构文档

> 版本：v1.0  
> 配套文档：PRD-封面设计工具.md  
> 读者：AI 编程工具（Cursor / Trae / Claude）

---

## 一、技术栈

| 层面 | 选型 | 版本要求 | 说明 |
|------|------|---------|------|
| 构建工具 | Vite | ^5.x | 原生 ESM，热更新快 |
| 框架 | Vue 3 | ^3.4 | Composition API + `<script setup>` |
| 语言 | TypeScript | ^5.x | 严格模式 |
| 样式 | Tailwind CSS | ^3.x | 工具类优先，不引入 UnoCSS 避免双重配置 |
| 状态管理 | Pinia | ^2.x | 按模块拆分 store |
| 图标渲染 | `@iconify/vue` | ^4.x | 在线按需加载 Iconify 图标 |
| 颜色选择器 | `@vueuse/components` + `vue-color-kit` | latest | 支持 HEX + RGBA |
| 拖拽排序 | `Sortable.js` + `vuedraggable` | ^4.x | 文本图层列表排序 |
| 画布导出 | `html-to-image` | ^1.11 | DOM → PNG/JPEG/WEBP，无需手写 Canvas |
| 文件下载 | 原生 `a[download]` | — | 无需额外依赖 |
| 工具函数 | `@vueuse/core` | ^10.x | useResizeObserver、useLocalStorage 等 |
| 持久化 | `localStorage` | — | 配置 JSON 序列化，通过 `@vueuse/core` 封装 |

**不引入**：Vue Router（单页无需路由）、axios（无后端请求）、任何 UI 组件库（避免样式冲突，全部手写）。

---

## 二、目录结构

```
cover-Craft/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   └── fonts/                  # 本地字体文件（woff2）
│       ├── MapleMono-CN.woff2
│       └── ...
└── src/
    ├── main.ts
    ├── App.vue                 # 根组件：左右布局框架
    ├── types/
    │   └── canvas.ts           # 所有 TS 类型定义
    ├── stores/
    │   ├── index.ts            # 导出所有 store
    │   ├── background.ts       # 背景配置 store
    │   ├── icon.ts             # 图标配置 store
    │   ├── textLayers.ts       # 多文本图层 store（核心）
    │   ├── watermark.ts        # 水印配置 store
    │   ├── exportConfig.ts     # 导出配置 store
    │   └── theme.ts            # 主题 / 配置持久化 store
    ├── composables/
    │   ├── useExport.ts        # 封装 html-to-image 导出逻辑
    │   ├── useFontLoader.ts    # 字体动态加载 + 加载状态
    │   ├── useAspectRatio.ts   # 比例联动逻辑
    │   └── useRandomFilename.ts # 随机文件名生成
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.vue       # 顶栏：标题 + 主题/保存/重置按钮
    │   │   ├── PanelLeft.vue       # 左侧配置区：Tab 切换容器
    │   │   └── PanelRight.vue      # 右侧预览区
    │   ├── panels/
    │   │   ├── BackgroundPanel.vue
    │   │   ├── IconPanel.vue
    │   │   ├── TextLayersPanel.vue # 多图层列表 + 单图层展开配置
    │   │   ├── WatermarkPanel.vue
    │   │   └── ExportPanel.vue
    │   ├── preview/
    │   │   ├── CanvasPreview.vue   # 预览画布根组件
    │   │   ├── PreviewBackground.vue
    │   │   ├── PreviewIcon.vue
    │   │   ├── PreviewTextLayer.vue # 单个文本图层渲染
    │   │   └── PreviewWatermark.vue
    │   └── ui/                 # 通用 UI 原子组件
    │       ├── ColorPicker.vue
    │       ├── SliderInput.vue
    │       ├── ToggleGroup.vue     # 胶囊按钮组（用于比例选择）
    │       ├── NumberInput.vue     # 宽高数字输入 ± 按钮
    │       ├── SelectInput.vue
    │       └── ConfirmModal.vue
    └── constants/
        ├── fonts.ts            # 内置字体列表
        ├── presets.ts          # 导出平台预设尺寸
        ├── themes.ts           # 内置主题数据
        └── aspectRatios.ts     # 比例列表定义
```

---

## 三、类型定义（`src/types/canvas.ts`）

```typescript
// ─── 背景 ────────────────────────────────────────────
export type BgType = 'solid' | 'gradient' | 'image'
export type GradientDirection =
  | 'to-right' | 'to-bottom' | 'to-bottom-right' | 'to-bottom-left'
  | 'to-top' | 'to-left'

export interface BackgroundConfig {
  type: BgType
  solidColor: string
  gradient: {
    start: string
    end: string
    direction: GradientDirection
  }
  imageUrl: string        // base64 或 object URL
  imageFit: 'cover' | 'contain' | 'fill'
  opacity: number         // 0–100
}

// ─── 图标 ────────────────────────────────────────────
export type IconType = 'iconify' | 'custom'

export interface IconConfig {
  type: IconType
  code: string            // 如 'fluent-emoji-flat:crescent-moon'
  customUrl: string       // 自定义图标 base64
  size: number            // px
  shadowSize: number      // px
  shadowColor: string
  x: number               // 0–100 %
  y: number               // 0–100 %
}

// ─── 文本图层 ─────────────────────────────────────────
export interface TextLayer {
  id: string
  label: string           // 图层列表显示名，用户可编辑
  text: string
  font: string
  bold: boolean
  italic: boolean
  fontSize: number        // px，12–400
  color: string           // HEX 含 alpha，如 '#e2e8f0ff'
  opacity: number         // 0–100
  letterSpacing: number   // px，-10 ~ 100
  rotate: number          // deg，-180 ~ 180
  shadowDepth: number     // 0–20，立体字
  x: number               // 0–100 %
  y: number               // 0–100 %
}

// ─── 水印 ────────────────────────────────────────────
export interface WatermarkConfig {
  text: string
  font: string
  bold: boolean
  italic: boolean
  uppercase: boolean
  fontSize: number
  opacity: number         // 0–100
  color: string
  x: number
  y: number
}

// ─── 导出 ────────────────────────────────────────────
export type ExportFormat = 'png' | 'jpeg' | 'webp'
export type AspectRatioKey = '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'free'

export interface ExportConfig {
  preset: string
  aspectRatio: AspectRatioKey
  width: number
  height: number
  format: ExportFormat
  quality: number         // 0–100
  filename: string
  useRandomFilename: boolean
  randomFilenameLength: number
  randomUseDigit: boolean
  randomUseLower: boolean
  randomUseUpper: boolean
}

// ─── 完整画布配置（用于持久化）────────────────────────
export interface CanvasConfig {
  background: BackgroundConfig
  icon: IconConfig
  textLayers: TextLayer[]
  watermark: WatermarkConfig
  export: ExportConfig
}

// ─── 主题 ────────────────────────────────────────────
export interface Theme {
  id: string
  name: string
  thumbnail: string       // 预览图 base64 或 URL
  config: Partial<CanvasConfig>
}

// ─── 已保存配置方案 ────────────────────────────────────
export interface SavedConfig {
  id: string
  name: string
  createdAt: number
  config: CanvasConfig
}
```

---

## 四、Pinia Store 设计

### 4.1 textLayers store（最复杂，重点说明）

**文件：`src/stores/textLayers.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid'   // 生成唯一 id，需安装：npm i nanoid
import type { TextLayer } from '@/types/canvas'

const DEFAULT_LAYER: Omit<TextLayer, 'id' | 'label'> = {
  text: '标题文字',
  font: 'Maple Mono CN',
  bold: true,
  italic: false,
  fontSize: 180,
  color: '#e2e8f0ff',
  opacity: 100,
  letterSpacing: 0,
  rotate: 0,
  shadowDepth: 0,
  x: 50,
  y: 50,
}

export const useTextLayersStore = defineStore('textLayers', () => {
  const layers = ref<TextLayer[]>([
    { id: nanoid(6), label: '图层 1', ...DEFAULT_LAYER }
  ])

  // 新增图层（复制最后一个图层的样式）
  function addLayer() {
    if (layers.value.length >= 10) return
    const last = layers.value[layers.value.length - 1]
    layers.value.push({
      ...last,
      id: nanoid(6),
      label: `图层 ${layers.value.length + 1}`,
      text: '新文本',
    })
  }

  // 删除图层（最少保留 1 个）
  function removeLayer(id: string) {
    if (layers.value.length <= 1) return
    layers.value = layers.value.filter(l => l.id !== id)
  }

  // 更新图层单个属性
  function updateLayer<K extends keyof TextLayer>(id: string, key: K, value: TextLayer[K]) {
    const layer = layers.value.find(l => l.id === id)
    if (layer) layer[key] = value
  }

  // 重排序（Sortable.js 回调后调用）
  function reorderLayers(newOrder: TextLayer[]) {
    layers.value = newOrder
  }

  return { layers, addLayer, removeLayer, updateLayer, reorderLayers }
})
```

### 4.2 exportConfig store（处理比例联动）

**文件：`src/stores/exportConfig.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ExportConfig, AspectRatioKey } from '@/types/canvas'
import { ASPECT_RATIO_MAP } from '@/constants/aspectRatios'

export const useExportConfigStore = defineStore('exportConfig', () => {
  const config = ref<ExportConfig>({
    preset: '通用 16:9 HD',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    format: 'webp',
    quality: 90,
    filename: '',
    useRandomFilename: true,
    randomFilenameLength: 12,
    randomUseDigit: true,
    randomUseLower: true,
    randomUseUpper: true,
  })

  // 切换比例：以当前宽度为基准重算高度
  function setAspectRatio(ratio: AspectRatioKey) {
    config.value.aspectRatio = ratio
    if (ratio === 'free') return
    const [w, h] = ASPECT_RATIO_MAP[ratio]
    config.value.height = Math.round(config.value.width * (h / w))
  }

  // 修改宽度：若锁定比例则联动高度
  function setWidth(w: number) {
    config.value.width = w
    if (config.value.aspectRatio === 'free') return
    const [rw, rh] = ASPECT_RATIO_MAP[config.value.aspectRatio]
    config.value.height = Math.round(w * (rh / rw))
  }

  // 修改高度：若锁定比例则联动宽度
  function setHeight(h: number) {
    config.value.height = h
    if (config.value.aspectRatio === 'free') return
    const [rw, rh] = ASPECT_RATIO_MAP[config.value.aspectRatio]
    config.value.width = Math.round(h * (rw / rh))
  }

  // 应用平台预设
  function applyPreset(presetName: string) {
    // 从 constants/presets.ts 中查找对应尺寸并设置
  }

  return { config, setAspectRatio, setWidth, setHeight, applyPreset }
})
```

### 4.3 theme store（持久化）

```typescript
// src/stores/theme.ts
// 使用 @vueuse/core 的 useLocalStorage 自动同步
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { SavedConfig, CanvasConfig } from '@/types/canvas'
import { nanoid } from 'nanoid'

export const useThemeStore = defineStore('theme', () => {
  const savedConfigs = useLocalStorage<SavedConfig[]>('cover-Craft:configs', [])

  function saveConfig(name: string, config: CanvasConfig) {
    savedConfigs.value.push({
      id: nanoid(8),
      name,
      createdAt: Date.now(),
      config,
    })
  }

  function loadConfig(id: string): CanvasConfig | null {
    return savedConfigs.value.find(c => c.id === id)?.config ?? null
  }

  function deleteConfig(id: string) {
    savedConfigs.value = savedConfigs.value.filter(c => c.id !== id)
  }

  return { savedConfigs, saveConfig, loadConfig, deleteConfig }
})
```

---

## 五、核心 Composables

### 5.1 `useExport.ts` — 导出逻辑

```typescript
// src/composables/useExport.ts
import { toPng, toJpeg, toBlob } from 'html-to-image'
import { ref } from 'vue'
import type { ExportConfig } from '@/types/canvas'

export function useExport() {
  const isExporting = ref(false)

  async function exportImage(
    el: HTMLElement,           // 预览画布 DOM 元素的引用
    config: ExportConfig,
    onFontReady: () => Promise<void>  // 确保字体加载完成的回调
  ) {
    isExporting.value = true
    try {
      // 1. 等待字体加载
      await onFontReady()

      // 2. 确定导出函数
      const options = {
        width: config.width,
        height: config.height,
        quality: config.quality / 100,
        pixelRatio: config.width / el.offsetWidth,  // 放大到目标分辨率
      }

      let blob: Blob | null = null
      if (config.format === 'png') {
        const dataUrl = await toPng(el, options)
        blob = dataUrlToBlob(dataUrl)
      } else if (config.format === 'jpeg') {
        const dataUrl = await toJpeg(el, options)
        blob = dataUrlToBlob(dataUrl)
      } else {
        // webp：html-to-image 不直接支持 webp，用 png 转 canvas 再 toBlob
        const dataUrl = await toPng(el, options)
        blob = await pngDataUrlToWebp(dataUrl, config.quality / 100)
      }

      if (!blob) throw new Error('导出失败')

      // 3. 触发下载
      const filename = resolveFilename(config)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      isExporting.value = false
    }
  }

  return { isExporting, exportImage }
}

// webp 转换：借助 Canvas
async function pngDataUrlToWebp(dataUrl: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      canvas.toBlob(b => b ? resolve(b) : reject(), 'image/webp', quality)
    }
    img.src = dataUrl
  })
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)![1]
  const bytes = atob(data)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

function resolveFilename(config: ExportConfig): string {
  if (!config.useRandomFilename && config.filename) {
    return `${config.filename}.${config.format}`
  }
  const chars = [
    ...(config.randomUseDigit ? '0123456789' : ''),
    ...(config.randomUseLower ? 'abcdefghijklmnopqrstuvwxyz' : ''),
    ...(config.randomUseUpper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''),
  ]
  if (!chars.length) return `cover.${config.format}`
  const name = Array.from(
    { length: config.randomFilenameLength },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `${name}.${config.format}`
}
```

### 5.2 `useFontLoader.ts` — 字体动态加载

```typescript
// src/composables/useFontLoader.ts
// 问题：html-to-image 导出时字体若未加载完成会回退到系统字体
// 解决：导出前用 FontFace API 强制等待所有用到的字体

import { FONT_URLS } from '@/constants/fonts'

const loadedFonts = new Set<string>()

export async function ensureFontsLoaded(fontNames: string[]): Promise<void> {
  const promises = fontNames
    .filter(name => !loadedFonts.has(name))
    .map(async name => {
      const url = FONT_URLS[name]
      if (!url) return
      const face = new FontFace(name, `url(${url})`)
      await face.load()
      document.fonts.add(face)
      loadedFonts.add(name)
    })
  await Promise.all(promises)
}
```

### 5.3 `useAspectRatio.ts`

```typescript
// src/composables/useAspectRatio.ts
// 封装比例按钮 UI 状态与联动逻辑，供 ExportPanel 使用
// 实际数据修改委托给 exportConfigStore

import { computed } from 'vue'
import { useExportConfigStore } from '@/stores/exportConfig'
import { ASPECT_RATIOS } from '@/constants/aspectRatios'

export function useAspectRatio() {
  const store = useExportConfigStore()

  const currentRatio = computed(() => store.config.aspectRatio)

  const ratioOptions = ASPECT_RATIOS.map(r => ({
    key: r.key,
    label: r.label,
    isActive: computed(() => currentRatio.value === r.key),
  }))

  return { ratioOptions, currentRatio, setRatio: store.setAspectRatio }
}
```

---

## 六、预览画布实现

### 6.1 CanvasPreview.vue 核心结构

```vue
<!-- src/components/preview/CanvasPreview.vue -->
<template>
  <!-- 外层容器：保持导出比例，自适应预览区宽度 -->
  <div class="canvas-wrapper" :style="wrapperStyle">
    <!-- 画布本体：固定为导出分辨率，用 scale 缩放 -->
    <div
      ref="canvasEl"
      class="canvas-inner"
      :style="canvasStyle"
    >
      <PreviewBackground />
      <PreviewIcon />
      <!-- 按图层顺序渲染，index 小的先渲染（在下层） -->
      <PreviewTextLayer
        v-for="layer in textLayersStore.layers"
        :key="layer.id"
        :layer="layer"
      />
      <PreviewWatermark />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useTextLayersStore } from '@/stores/textLayers'

const exportStore = useExportConfigStore()
const textLayersStore = useTextLayersStore()

const canvasEl = ref<HTMLElement>()

// 预览区容器宽度（通过 ResizeObserver 监听）
const containerWidth = ref(800)

const scale = computed(() =>
  containerWidth.value / exportStore.config.width
)

const wrapperStyle = computed(() => ({
  width: '100%',
  aspectRatio: `${exportStore.config.width} / ${exportStore.config.height}`,
  position: 'relative',
  overflow: 'hidden',
}))

// 画布保持导出分辨率，通过 CSS scale 缩放到容器大小
const canvasStyle = computed(() => ({
  width: `${exportStore.config.width}px`,
  height: `${exportStore.config.height}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  position: 'absolute',
  top: 0,
  left: 0,
}))

defineExpose({ canvasEl })
</script>
```

**关键设计**：画布始终保持真实导出分辨率（如 1920×1080），通过 CSS `scale()` 缩小到预览区。这样 `html-to-image` 截图时拿到的就是真实分辨率的 DOM，无需额外缩放处理。

### 6.2 PreviewTextLayer.vue 核心样式映射

```vue
<!-- src/components/preview/PreviewTextLayer.vue -->
<template>
  <div class="text-layer" :style="layerStyle">
    {{ layer.text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextLayer } from '@/types/canvas'

const props = defineProps<{ layer: TextLayer }>()

const layerStyle = computed(() => {
  const { layer } = props
  // 立体字：叠加多层 text-shadow 模拟深度
  const shadowLayers = layer.shadowDepth > 0
    ? Array.from({ length: layer.shadowDepth }, (_, i) =>
        `${i + 1}px ${i + 1}px 0 rgba(0,0,0,0.3)`
      ).join(', ')
    : 'none'

  return {
    position: 'absolute',
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    transform: `translate(-50%, -50%) rotate(${layer.rotate}deg)`,
    fontFamily: `"${layer.font}", sans-serif`,
    fontWeight: layer.bold ? '700' : '400',
    fontStyle: layer.italic ? 'italic' : 'normal',
    fontSize: `${layer.fontSize}px`,
    color: layer.color,
    opacity: layer.opacity / 100,
    letterSpacing: `${layer.letterSpacing}px`,
    textShadow: shadowLayers,
    whiteSpace: 'pre-wrap',      // 保留换行
    userSelect: 'none',
    pointerEvents: 'none',
  }
})
</script>
```

---

## 七、常量文件

### `src/constants/aspectRatios.ts`

```typescript
export type AspectRatioKey = '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | 'free'

export const ASPECT_RATIOS: { key: AspectRatioKey; label: string }[] = [
  { key: '16:9',  label: '16:9'  },
  { key: '4:3',   label: '4:3'   },
  { key: '1:1',   label: '1:1'   },
  { key: '3:4',   label: '3:4'   },
  { key: '9:16',  label: '9:16'  },
  { key: 'free',  label: '自由'  },
]

// [宽份数, 高份数]
export const ASPECT_RATIO_MAP: Record<Exclude<AspectRatioKey, 'free'>, [number, number]> = {
  '16:9': [16, 9],
  '4:3':  [4,  3],
  '1:1':  [1,  1],
  '3:4':  [3,  4],
  '9:16': [9,  16],
}
```

### `src/constants/presets.ts`

```typescript
export interface ExportPreset {
  name: string
  width: number
  height: number
}

export const EXPORT_PRESETS: ExportPreset[] = [
  { name: '自定义',           width: 1920, height: 1080 },
  { name: '通用 16:9 HD',    width: 1920, height: 1080 },
  { name: '公众号封面首图',   width: 900,  height: 383  },
  { name: '公众号次图',       width: 200,  height: 200  },
  { name: '小红书正方形',     width: 1080, height: 1080 },
  { name: '小红书竖图',       width: 1080, height: 1440 },
  { name: 'B站横幅',          width: 1920, height: 540  },
  { name: 'YouTube 缩略图',  width: 1280, height: 720  },
  { name: 'Twitter/X 卡片',  width: 1200, height: 628  },
  { name: 'GitHub 社交预览', width: 1280, height: 640  },
]
```

### `src/constants/fonts.ts`

```typescript
// 内置字体列表（woff2 放在 public/fonts/）
export const FONT_LIST = [
  'Maple Mono CN',
  'Noto Sans SC',
  'Noto Serif SC',
  'Source Han Sans CN',
  'ZCOOL XiaoWei',
  'Ma Shan Zheng',
]

export const FONT_URLS: Record<string, string> = {
  'Maple Mono CN': '/fonts/MapleMono-CN.woff2',
  'Noto Sans SC':  'https://fonts.gstatic.com/...', // 也可走 Google Fonts
  // ...
}
```

---

## 八、性能与体验要点

| 问题 | 解决方案 |
|------|---------|
| 预览抖动（每次配置变更重新渲染整个画布） | 各 PreviewXxx 组件各自 watch 自己的 store 分片，独立更新，不整体重渲 |
| 导出时字体未加载导致回退 | `useExport` 导出前调用 `ensureFontsLoaded`，阻塞等待 |
| 图片背景上传后 base64 体积大 | 上传时用 `createObjectURL` 存 URL，不存 base64；序列化配置时单独处理 |
| Iconify 图标首次加载慢 | 配置区输入防抖 300ms 再触发图标请求 |
| 导出分辨率与预览不一致 | 画布保持真实分辨率，预览仅 CSS scale，导出直接截真实 DOM |
| `html-to-image` 跨域图片报错 | 背景图片统一转 base64 或 objectURL 存入 store，避免跨域 |

---

## 九、初始化与启动

```bash
# 1. 创建项目
npm create vite@latest cover-Craft -- --template vue-ts

# 2. 安装依赖
cd cover-Craft
npm install
npm install pinia @vueuse/core @vueuse/components
npm install @iconify/vue
npm install html-to-image
npm install vuedraggable@next sortablejs
npm install nanoid
npm install vue-color-kit
npm install -D tailwindcss postcss autoprefixer @types/sortablejs
npx tailwindcss init -p

# 3. 开发启动
npm run dev

# 4. 构建
npm run build
```

---

## 十、注意事项（给 AI 编程工具）

1. **不要引入 Vue Router**，整个应用是单页单视图。
2. **颜色值统一用带 alpha 的 8 位 HEX**（如 `#e2e8f0ff`），颜色选择器输出和 store 存储格式保持一致。
3. **`html-to-image` 的 `pixelRatio` 参数**是关键：设置为 `导出宽度 / 预览画布实际渲染宽度`，才能得到真实分辨率的图片。
4. **图层 id 用 `nanoid(6)`** 生成，不要用数组下标作为 key，否则拖拽排序后 Vue diff 会出错。
5. **`useLocalStorage` 不要直接存包含 `File` / `Blob` 的对象**，图片上传后必须先转为 base64 字符串再存 store。
6. **立体字效果**用多层 `text-shadow` 叠加实现，不要用 CSS `filter: drop-shadow`（后者在 `html-to-image` 中渲染结果不稳定）。
7. **Sortable.js 与 Vue `v-for` 配合**时，拖拽结束后必须同步调用 `reorderLayers(newOrder)` 更新 store，否则 Vue 响应式和 DOM 顺序会不一致。