import type { AspectRatioKey } from '@/types/canvas'

export const ASPECT_RATIOS: { key: AspectRatioKey; label: string }[] = [
  { key: '16:9', label: '16:9' },
  { key: '4:3', label: '4:3' },
  { key: '1:1', label: '1:1' },
  { key: '3:4', label: '3:4' },
  { key: '9:16', label: '9:16' },
  { key: 'free', label: '自由' },
]

export const ASPECT_RATIO_MAP: Record<Exclude<AspectRatioKey, 'free'>, [number, number]> = {
  '16:9': [16, 9],
  '4:3': [4, 3],
  '1:1': [1, 1],
  '3:4': [3, 4],
  '9:16': [9, 16],
}
