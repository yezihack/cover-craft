<template>
  <div ref="wrapperEl" class="canvas-wrapper" :style="wrapperStyle">
    <div ref="canvasEl" class="canvas-inner" :style="canvasStyle">
      <PreviewBackground />
      <PreviewIcon />
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
import { useResizeObserver } from '@vueuse/core'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useTextLayersStore } from '@/stores/textLayers'
import PreviewBackground from './PreviewBackground.vue'
import PreviewIcon from './PreviewIcon.vue'
import PreviewTextLayer from './PreviewTextLayer.vue'
import PreviewWatermark from './PreviewWatermark.vue'

const exportStore = useExportConfigStore()
const textLayersStore = useTextLayersStore()

const canvasEl = ref<HTMLElement>()
const wrapperEl = ref<HTMLElement>()
const containerWidth = ref(800)
const containerHeight = ref(600)

useResizeObserver(wrapperEl, (entries) => {
  const entry = entries[0]
  if (entry) {
    containerWidth.value = entry.contentRect.width
    containerHeight.value = entry.contentRect.height
  }
})

const scale = computed(() => {
  const w = exportStore.config.width
  const h = exportStore.config.height
  if (!w || !h) return 1
  // 取宽高两个方向的最小缩放比，确保画布完全适配在容器内
  const scaleX = containerWidth.value / w
  const scaleY = containerHeight.value / h
  return Math.min(scaleX, scaleY)
})

const wrapperStyle = computed(() => ({
  width: '100%',
  aspectRatio: `${exportStore.config.width} / ${exportStore.config.height}`,
  position: 'relative' as const,
  overflow: 'hidden',
  background: '#1e293b',
  borderRadius: '8px',
}))

const canvasStyle = computed(() => ({
  width: `${exportStore.config.width}px`,
  height: `${exportStore.config.height}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  position: 'absolute' as const,
  top: 0,
  left: 0,
}))

defineExpose({ canvasEl })
</script>
