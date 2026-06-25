import { toPng, toJpeg } from 'html-to-image'
import { ref } from 'vue'
import type { ExportConfig } from '@/types/canvas'

export function useExport() {
  const isExporting = ref(false)

  async function exportImage(
    el: HTMLElement,
    config: ExportConfig,
    onFontReady: () => Promise<void>,
  ) {
    isExporting.value = true

    // 导出前移除 CSS scale，确保 html-to-image 截取 1:1 真实分辨率
    const origTransform = el.style.transform
    el.style.transform = ''

    try {
      await onFontReady()

      const options = {
        width: config.width,
        height: config.height,
        quality: config.quality / 100,
      }

      let blob: Blob | null = null

      if (config.format === 'png') {
        const dataUrl = await toPng(el, options)
        blob = dataUrlToBlob(dataUrl)
      } else if (config.format === 'jpeg') {
        const dataUrl = await toJpeg(el, options)
        blob = dataUrlToBlob(dataUrl)
      } else {
        const dataUrl = await toPng(el, options)
        blob = await pngDataUrlToWebp(dataUrl, config.quality / 100)
      }

      if (!blob) throw new Error('导出失败')

      const filename = resolveFilename(config)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      // 恢复 CSS scale
      el.style.transform = origTransform
      isExporting.value = false
    }
  }

  return { isExporting, exportImage }
}

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
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return `${name}.${config.format}`
}
