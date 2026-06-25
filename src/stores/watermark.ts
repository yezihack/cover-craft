import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WatermarkConfig } from '@/types/canvas'

export const useWatermarkStore = defineStore('watermark', () => {
  const config = ref<WatermarkConfig>({
    text: '@yezihack-cover-designer',
    font: 'Inter',
    bold: false,
    italic: false,
    uppercase: false,
    fontSize: 16,
    opacity: 40,
    color: '#ffffff',
    x: 95,
    y: 95,
  })

  function update<K extends keyof WatermarkConfig>(key: K, value: WatermarkConfig[K]) {
    (config.value as Record<string, unknown>)[key] = value
  }

  function loadFrom(cfg: Partial<WatermarkConfig>) {
    Object.assign(config.value, cfg)
  }

  function reset() {
    config.value = {
      text: '@yezihack-cover-designer',
      font: 'Inter',
      bold: false,
      italic: false,
      uppercase: false,
      fontSize: 16,
      opacity: 40,
      color: '#ffffff',
      x: 95,
      y: 95,
    }
  }

  return { config, update, loadFrom, reset }
})
