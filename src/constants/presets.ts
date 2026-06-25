import type { AspectRatioKey } from '@/types/canvas'

export interface ExportPreset {
  name: string
  width: number
  height: number
  aspectRatio: AspectRatioKey
}

export const EXPORT_PRESETS: ExportPreset[] = [
  { name: '自定义', width: 1920, height: 1080, aspectRatio: 'free' },
  { name: '通用 16:9 HD', width: 1920, height: 1080, aspectRatio: '16:9' },
  { name: '公众号封面首图', width: 900, height: 383, aspectRatio: 'free' },
  { name: '公众号次图', width: 200, height: 200, aspectRatio: '1:1' },
  { name: '小红书正方形', width: 1080, height: 1080, aspectRatio: '1:1' },
  { name: '小红书竖图', width: 1080, height: 1440, aspectRatio: '3:4' },
  { name: 'B站横幅', width: 1920, height: 540, aspectRatio: 'free' },
  { name: 'YouTube 缩略图', width: 1280, height: 720, aspectRatio: '16:9' },
  { name: 'Twitter/X 卡片', width: 1200, height: 628, aspectRatio: 'free' },
  { name: 'GitHub 社交预览', width: 1280, height: 640, aspectRatio: 'free' },
]
