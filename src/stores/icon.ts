import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IconConfig, IconType } from '@/types/canvas'

export const useIconStore = defineStore('icon', () => {
  const config = ref<IconConfig>({
    type: 'iconify',
    code: 'fluent-emoji-flat:crescent-moon',
    customUrl: '',
    size: 120,
    shadowSize: 0,
    shadowColor: '#000000ff',
    x: 50,
    y: 25,
  })

  function setType(type: IconType) {
    config.value.type = type
  }

  function setCode(code: string) {
    config.value.code = code
  }

  function setCustomUrl(url: string) {
    config.value.customUrl = url
  }

  function setSize(size: number) {
    config.value.size = size
  }

  function setShadowSize(size: number) {
    config.value.shadowSize = size
  }

  function setShadowColor(color: string) {
    config.value.shadowColor = color
  }

  function setX(x: number) {
    config.value.x = x
  }

  function setY(y: number) {
    config.value.y = y
  }

  function loadFrom(cfg: Partial<IconConfig>) {
    if (cfg.type !== undefined) config.value.type = cfg.type
    if (cfg.code !== undefined) config.value.code = cfg.code
    if (cfg.customUrl !== undefined) config.value.customUrl = cfg.customUrl
    if (cfg.size !== undefined) config.value.size = cfg.size
    if (cfg.shadowSize !== undefined) config.value.shadowSize = cfg.shadowSize
    if (cfg.shadowColor !== undefined) config.value.shadowColor = cfg.shadowColor
    if (cfg.x !== undefined) config.value.x = cfg.x
    if (cfg.y !== undefined) config.value.y = cfg.y
  }

  function reset() {
    config.value = {
      type: 'iconify',
      code: 'fluent-emoji-flat:crescent-moon',
      customUrl: '',
      size: 120,
      shadowSize: 0,
      shadowColor: '#000000ff',
      x: 50,
      y: 25,
    }
  }

  return { config, setType, setCode, setCustomUrl, setSize, setShadowSize, setShadowColor, setX, setY, loadFrom, reset }
})
