import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ExportConfig, AspectRatioKey } from '@/types/canvas'
import { ASPECT_RATIO_MAP } from '@/constants/aspectRatios'
import { EXPORT_PRESETS } from '@/constants/presets'

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
    randomFilenameLength: 32,
    randomUseDigit: true,
    randomUseLower: true,
    randomUseUpper: true,
  })

  function setAspectRatio(ratio: AspectRatioKey) {
    config.value.aspectRatio = ratio
    if (ratio === 'free') return
    const [w, h] = ASPECT_RATIO_MAP[ratio]
    config.value.height = Math.round(config.value.width * (h / w))
  }

  function setWidth(w: number) {
    config.value.width = w
    if (config.value.aspectRatio === 'free') return
    const [rw, rh] = ASPECT_RATIO_MAP[config.value.aspectRatio]
    config.value.height = Math.round(w * (rh / rw))
  }

  function setHeight(h: number) {
    config.value.height = h
    if (config.value.aspectRatio === 'free') return
    const [rw, rh] = ASPECT_RATIO_MAP[config.value.aspectRatio]
    config.value.width = Math.round(h * (rw / rh))
  }

  function applyPreset(presetName: string) {
    const preset = EXPORT_PRESETS.find(p => p.name === presetName)
    if (!preset) return
    config.value.preset = preset.name
    config.value.width = preset.width
    config.value.height = preset.height
    config.value.aspectRatio = preset.aspectRatio
  }

  function loadFrom(cfg: Partial<ExportConfig>) {
    if (cfg.preset !== undefined) config.value.preset = cfg.preset
    if (cfg.aspectRatio !== undefined) config.value.aspectRatio = cfg.aspectRatio
    if (cfg.width !== undefined) config.value.width = cfg.width
    if (cfg.height !== undefined) config.value.height = cfg.height
    if (cfg.format !== undefined) config.value.format = cfg.format
    if (cfg.quality !== undefined) config.value.quality = cfg.quality
    if (cfg.filename !== undefined) config.value.filename = cfg.filename
    if (cfg.useRandomFilename !== undefined) config.value.useRandomFilename = cfg.useRandomFilename
    if (cfg.randomFilenameLength !== undefined) config.value.randomFilenameLength = cfg.randomFilenameLength
    if (cfg.randomUseDigit !== undefined) config.value.randomUseDigit = cfg.randomUseDigit
    if (cfg.randomUseLower !== undefined) config.value.randomUseLower = cfg.randomUseLower
    if (cfg.randomUseUpper !== undefined) config.value.randomUseUpper = cfg.randomUseUpper
  }

  function reset() {
    config.value = {
      preset: '通用 16:9 HD',
      aspectRatio: '16:9',
      width: 1920,
      height: 1080,
      format: 'webp',
      quality: 90,
      filename: '',
      useRandomFilename: true,
      randomFilenameLength: 32,
      randomUseDigit: true,
      randomUseLower: true,
      randomUseUpper: true,
    }
  }

  return { config, setAspectRatio, setWidth, setHeight, applyPreset, loadFrom, reset }
})
