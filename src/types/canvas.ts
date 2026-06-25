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
  imageUrl: string
  imageFit: 'cover' | 'contain' | 'fill'
  opacity: number
}

// ─── 图标 ────────────────────────────────────────────
export type IconType = 'iconify' | 'custom'

export interface IconConfig {
  type: IconType
  code: string
  customUrl: string
  size: number
  shadowSize: number
  shadowColor: string
  x: number
  y: number
}

// ─── 文本图层 ─────────────────────────────────────────
export interface TextLayer {
  id: string
  label: string
  text: string
  font: string
  bold: boolean
  italic: boolean
  fontSize: number
  color: string
  opacity: number
  letterSpacing: number
  rotate: number
  shadowDepth: number
  x: number
  y: number
}

// ─── 水印 ────────────────────────────────────────────
export interface WatermarkConfig {
  text: string
  font: string
  bold: boolean
  italic: boolean
  uppercase: boolean
  fontSize: number
  opacity: number
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
  quality: number
  filename: string
  useRandomFilename: boolean
  randomFilenameLength: number
  randomUseDigit: boolean
  randomUseLower: boolean
  randomUseUpper: boolean
}

// ─── 完整画布配置 ────────────────────────────────────
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
  thumbnail: string
  config: Partial<CanvasConfig>
}

// ─── 已保存配置方案 ────────────────────────────────────
export interface SavedConfig {
  id: string
  name: string
  createdAt: number
  config: CanvasConfig
}
