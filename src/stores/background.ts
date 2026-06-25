import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BackgroundConfig, BgType, GradientDirection } from '@/types/canvas'

export const useBackgroundStore = defineStore('background', () => {
  const config = ref<BackgroundConfig>({
    type: 'gradient',
    solidColor: '#0f172aff',
    gradient: {
      start: '#0f172aff',
      end: '#1e1b4bff',
      direction: 'to-bottom',
    },
    imageUrl: '',
    imageFit: 'cover',
    opacity: 100,
  })

  function setType(type: BgType) {
    config.value.type = type
  }

  function setSolidColor(color: string) {
    config.value.solidColor = color
  }

  function setGradientStart(color: string) {
    config.value.gradient.start = color
  }

  function setGradientEnd(color: string) {
    config.value.gradient.end = color
  }

  function setGradientDirection(direction: GradientDirection) {
    config.value.gradient.direction = direction
  }

  function setImageUrl(url: string) {
    config.value.imageUrl = url
  }

  function setImageFit(fit: 'cover' | 'contain' | 'fill') {
    config.value.imageFit = fit
  }

  function setOpacity(opacity: number) {
    config.value.opacity = opacity
  }

  function loadFrom(cfg: Partial<BackgroundConfig>) {
    if (!cfg) return
    if (cfg.type !== undefined) config.value.type = cfg.type
    if (cfg.solidColor !== undefined) config.value.solidColor = cfg.solidColor
    if (cfg.gradient) {
      if (cfg.gradient.start) config.value.gradient.start = cfg.gradient.start
      if (cfg.gradient.end) config.value.gradient.end = cfg.gradient.end
      if (cfg.gradient.direction) config.value.gradient.direction = cfg.gradient.direction
    }
    if (cfg.imageUrl !== undefined) config.value.imageUrl = cfg.imageUrl
    if (cfg.imageFit !== undefined) config.value.imageFit = cfg.imageFit
    if (cfg.opacity !== undefined) config.value.opacity = cfg.opacity
  }

  function reset() {
    config.value = {
      type: 'gradient',
      solidColor: '#0f172aff',
      gradient: { start: '#0f172aff', end: '#1e1b4bff', direction: 'to-bottom' },
      imageUrl: '',
      imageFit: 'cover',
      opacity: 100,
    }
  }

  return {
    config,
    setType, setSolidColor, setGradientStart, setGradientEnd,
    setGradientDirection, setImageUrl, setImageFit, setOpacity,
    loadFrom, reset,
  }
})
