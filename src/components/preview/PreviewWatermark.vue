<template>
  <div
    class="absolute"
    :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
    :style="watermarkStyle"
    @mousedown="onMouseDown"
  >
    {{ displayText }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWatermarkStore } from '@/stores/watermark'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useDragPosition } from '@/composables/useDragPosition'

const store = useWatermarkStore()
const { config } = storeToRefs(store)
const exportStore = useExportConfigStore()

const { isDragging, onMouseDown } = useDragPosition({
  canvasWidth: exportStore.config.width,
  canvasHeight: exportStore.config.height,
  getX: () => config.value.x,
  getY: () => config.value.y,
  onMove: (x, y) => {
    store.update('x', x)
    store.update('y', y)
  },
})

const displayText = computed(() =>
  config.value.uppercase ? config.value.text.toUpperCase() : config.value.text,
)

const watermarkStyle = computed(() => {
  const c = config.value
  return {
    left: `${c.x}%`,
    top: `${c.y}%`,
    transform: 'translate(-50%, -50%)',
    fontFamily: `"${c.font}", "Noto Sans SC", sans-serif`,
    fontWeight: c.bold ? '700' : '400',
    fontStyle: c.italic ? 'italic' : 'normal',
    fontSize: `${c.fontSize}px`,
    color: c.color,
    opacity: c.opacity / 100,
    userSelect: 'none' as const,
    pointerEvents: 'auto' as const,
  }
})
</script>
