<template>
  <div
    class="absolute"
    :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
    :style="layerStyle"
    @mousedown="onMouseDown"
  >
    {{ layer.text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextLayer } from '@/types/canvas'
import { useTextLayersStore } from '@/stores/textLayers'
import { useExportConfigStore } from '@/stores/exportConfig'
import { useDragPosition } from '@/composables/useDragPosition'

const props = defineProps<{ layer: TextLayer }>()

const textStore = useTextLayersStore()
const exportStore = useExportConfigStore()

const { isDragging, onMouseDown } = useDragPosition({
  canvasWidth: exportStore.config.width,
  canvasHeight: exportStore.config.height,
  getX: () => props.layer.x,
  getY: () => props.layer.y,
  onMove: (x, y) => {
    textStore.updateLayer(props.layer.id, 'x', x)
    textStore.updateLayer(props.layer.id, 'y', y)
  },
})

const layerStyle = computed(() => {
  const l = props.layer
  const shadowLayers = l.shadowDepth > 0
    ? Array.from({ length: l.shadowDepth }, (_, i) =>
        `${i + 1}px ${i + 1}px 0 rgba(0,0,0,0.3)`,
      ).join(', ')
    : 'none'

  return {
    left: `${l.x}%`,
    top: `${l.y}%`,
    transform: `translate(-50%, -50%) rotate(${l.rotate}deg)`,
    fontFamily: `"${l.font}", "Noto Sans SC", sans-serif`,
    fontWeight: l.bold ? '700' : '400',
    fontStyle: l.italic ? 'italic' : 'normal',
    fontSize: `${l.fontSize}px`,
    color: l.color,
    opacity: l.opacity / 100,
    letterSpacing: `${l.letterSpacing}px`,
    textShadow: shadowLayers,
    whiteSpace: 'pre-wrap' as const,
    userSelect: 'none' as const,
    pointerEvents: 'auto' as const,
    textAlign: 'center' as const,
    lineHeight: 1.2,
  }
})
</script>
